import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Input, message, Modal } from 'antd';
import AdminServices from '../../services/AdminServices';

interface CategoryModalProps {
  ref: boolean;
  data: {
    categoryId: string;
    level: number;
  }
}
function CategoryModal(props: CategoryModalProps, ref: any) {
  const { data } = props;
  const [states, setStates] = useState({
    visible: false,
    confirmLoading: false,
    fatherId: props.data.categoryId,
    level: props.data.level,
    categoryName: ''
  });

  useEffect(() => {
    setStates(prev => ({ ...prev, level: data.level, fatherId: data.categoryId }))
  }, [data]);

  useImperativeHandle(ref, () => ({
    setStates,
  }));

  const handleOk = async () => {
    const { fatherId, level, categoryName } = states;
    const data = await AdminServices.addCategory(fatherId, level, categoryName)
      .catch((e: any) => message.error(`错误：${e}`));
    if (data.success) {
      message.success('添加成功');
    } else {
      message.warning(data.msg);
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
      onCancel={() => setStates(prev => ({ ...prev, visible: false }))}
    >
      <p>
        <Input
          value={states.categoryName}
          onChange={e => setStates(prev => ({ ...prev, categoryName: e.target.value }))}
          placeholder="类目名"
        />
      </p>
    </Modal>
  );
}

export default React.forwardRef(CategoryModal);