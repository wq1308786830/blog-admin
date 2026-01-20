import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import { Input, message, Modal } from 'antd';
import AdminServices from '@/services/AdminServices';

interface CategoryModalProps {
  data: {
    categoryId: string;
    level: number;
  };
}

function CategoryModal(props: CategoryModalProps, ref: React.ForwardedRef<unknown>) {
  const { data } = props;
  const [states, setStates] = useState({
    visible: false,
    confirmLoading: false,
    fatherId: data.categoryId,
    level: data.level,
    categoryName: '',
  });

  useEffect(() => {
    setStates((prev) => ({ ...prev, level: data.level, fatherId: data.categoryId }));
  }, [data]);

  useImperativeHandle(ref, () => ({
    setStates,
  }));

  const handleOk = async () => {
    const { fatherId, level, categoryName } = states;
    try {
      const resp = await AdminServices.addCategory(Number(fatherId), level, categoryName);
      if (resp.success) {
        message.success('添加成功');
      } else {
        message.warning(resp.msg);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(`错误：${e.message}`);
      } else {
        message.error('未知错误');
      }
    }
  };

  const { confirmLoading } = states;
  return (
    <Modal
      width={300}
      title="添加类目"
      okText="确定"
      cancelText="取消"
      wrapClassName="vertical-center-modal"
      open={states.visible}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={() => setStates((prev) => ({ ...prev, visible: false }))}
    >
      <p>
        <Input
          value={states.categoryName}
          onChange={(e) => setStates((prev) => ({ ...prev, categoryName: e.target.value }))}
          placeholder="类目名"
        />
      </p>
    </Modal>
  );
}

export default forwardRef(CategoryModal);
