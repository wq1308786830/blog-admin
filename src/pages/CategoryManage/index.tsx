import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useCategories, useAddCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CascaderSelect } from '@/components/form/CascaderSelect';
import type { CascaderOption } from '@/components/form/CascaderSelect';
import './index.scss';

function Index() {
  const { data: options = [] } = useCategories();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();

  const [categoryName, setCategoryName] = useState('');
  const [category, setCategory] = useState<(string | number)[]>([]);

  const handleCascaderChange = (value: (string | number)[]) => {
    setCategory(value);
  };

  const handleDelete = () => {
    if (category.length === 0) {
      return;
    }
    const id = Number(category[category.length - 1]);
    deleteCategory.mutate(id);
  };

  const handleAdd = () => {
    if (!categoryName.trim()) {
      return;
    }
    if (category.length === 0) {
      return;
    }

    const id = Number(category[category.length - 1]);

    addCategory.mutate(
      {
        fatherId: id,
        level: 1, // Will be calculated by backend
        categoryName,
      },
      {
        onSuccess: () => {
          setCategoryName('');
          setCategory([]);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="flex items-center w-[500px] gap-2">
        <CascaderSelect
          value={category}
          onChange={handleCascaderChange}
          options={options as CascaderOption[]}
          placeholder="选择要删除的类目"
          className="flex-1"
        />
        <Button
          onClick={handleDelete}
          disabled={!category || deleteCategory.isPending}
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
          删除
        </Button>
      </div>
      <div className="flex items-center w-[500px] gap-2">
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="输入新类目名称"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={handleAdd}
          disabled={!categoryName.trim() || !category || addCategory.isPending}
        >
          <Plus className="h-4 w-4" />
          添加
        </Button>
      </div>
    </div>
  );
}

export default Index;
