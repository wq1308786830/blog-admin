import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import AdminServices from '@/services/AdminServices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { showSuccess, showError, showWarning } from '@/lib/toast';

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
      const resp = await AdminServices.addCategory(Number(fatherId), level, categoryName || '');
      if (resp.success) {
        showSuccess('添加成功');
        setStates((prev) => ({ ...prev, visible: false, categoryName: '' }));
      } else {
        showWarning(resp.msg || '添加失败');
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        showError(`错误：${e.message}`);
      } else {
        showError('未知错误');
      }
    }
  };

  return (
    <Dialog open={states.visible} onOpenChange={(open) => setStates((prev) => ({ ...prev, visible: open }))}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>添加类目</DialogTitle>
          <DialogDescription>输入新类目的名称</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={states.categoryName}
            onChange={(e) => setStates((prev) => ({ ...prev, categoryName: e.target.value }))}
            placeholder="类目名"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setStates((prev) => ({ ...prev, visible: false }))}>
            取消
          </Button>
          <Button onClick={handleOk} disabled={states.confirmLoading}>
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default forwardRef(CategoryModal);
