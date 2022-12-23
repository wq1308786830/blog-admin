import React, { useEffect, useState } from 'react';
import { Button, Cascader, Input, message } from 'antd';
import { handleOptions } from '@/utils/tools';
import BlogServices from '@/services/BlogServices';
import AdminServices from '@/services/AdminServices';
import './index.scss';

interface States {
  categoryName: string;
  category: any[];
  options: any[];
}
function Index() {
  const [states, setStates] = useState<States>({
    categoryName: '',
    category: [],
    options: [],
  });

  // get all categories data in json string.
  const getAllCategories = async () => {
    const resp: any = await BlogServices.getAllCategories().catch((err: any) =>
      message.error(`错误：${err}`)
    );
    if (resp.success) {
      setStates((prev) => ({ ...prev, options: handleOptions(resp.data, []) }));
    } else {
      message.warning(resp.msg);
      setStates((prev) => ({ ...prev, options: [] }));
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const delCategory = async () => {
    const { category } = states;
    const data: any = await BlogServices.deleteCategory(category[category.length - 1]).catch((e) =>
      message.error(`错误：${e}`)
    );
    if (data.success) {
      message.success('删除成功');
    } else {
      message.warning(data.msg);
    }
  };

  const onCascaderChange = (value: any[]) => {
    // changeSelectState();
    setStates((prev: any) => ({
      ...prev,
      category: value,
    }));
  };

  const handleOk = async () => {
    const { category, categoryName } = states;
    const resp: any = await AdminServices.addCategory(
      category[category.length - 1],
      category.length,
      categoryName
    ).catch((e: any) => message.error(`错误：${e}`));
    if (resp.success) {
      message.success('添加成功');
      getAllCategories();
    } else {
      message.warning(resp.msg);
    }
  };

  const { category, options } = states;
  return (
    <div className="CategoryManage">
      <div className="category-item">
        <Cascader
          value={category}
          style={{ width: '100%' }}
          options={options}
          placeholder="类目"
          onChange={onCascaderChange}
          changeOnSelect
        />
        <Button style={{ margin: '0 10px' }} onClick={delCategory}>
          删除
        </Button>
      </div>
      <div className="category-item">
        <Input
          value={states.categoryName}
          onChange={(e) => setStates((prev) => ({ ...prev, categoryName: e.target.value }))}
          placeholder="类目名"
        />
        <Button style={{ margin: '0 10px' }} type="primary" onClick={handleOk}>
          添加
        </Button>
      </div>
    </div>
  );
}

export default Index;
