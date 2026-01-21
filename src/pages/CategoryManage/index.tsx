import { useState } from 'react';
import { Button, Cascader, Input } from 'antd';
import { useCategories, useAddCategory, useDeleteCategory } from '@/hooks/useCategories';
import './index.scss';

function Index() {
  const { data: options = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();

  const [categoryName, setCategoryName] = useState('');
  const [category, setCategory] = useState<any[]>([]);

  const handleCascaderChange = (value: any[]) => {
    setCategory(value);
  };

  const handleDelete = () => {
    if (category.length === 0) {
      return;
    }
    const categoryId = category[category.length - 1];
    deleteCategory.mutate(categoryId);
  };

  const handleAdd = () => {
    if (!categoryName.trim()) {
      return;
    }
    if (category.length === 0) {
      return;
    }

    addCategory.mutate(
      {
        fatherId: category[category.length - 1],
        level: category.length,
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
    <div className="CategoryManage">
      <div className="category-item">
        <Cascader
          value={category}
          style={{ width: '100%' }}
          options={options}
          placeholder="类目"
          onChange={handleCascaderChange}
          changeOnSelect
          loading={isLoading}
        />
        <Button
          style={{ margin: '0 10px' }}
          onClick={handleDelete}
          loading={deleteCategory.isPending}
          disabled={category.length === 0}
        >
          删除
        </Button>
      </div>
      <div className="category-item">
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="类目名"
          onPressEnter={handleAdd}
        />
        <Button
          style={{ margin: '0 10px' }}
          type="primary"
          onClick={handleAdd}
          loading={addCategory.isPending}
          disabled={!categoryName.trim() || category.length === 0}
        >
          添加
        </Button>
      </div>
    </div>
  );
}

export default Index;
