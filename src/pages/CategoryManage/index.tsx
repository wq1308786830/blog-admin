import React, {useEffect, useRef, useState} from 'react';
import { Button, message, Select } from 'antd';
import CategoryModal from './CategoryModal';
import BlogServices from '../../services/BlogServices';
import './index.scss';

interface States {
  curId: any[],
  children1: any[],
  children2: any[],
  children3: any[],
  categoryData: any[]
}
const { Option } = Select;
let categoryTemp: [] | null = null; // category cache data.
function Index() {
  const categoryModal = useRef<{setStates: Function}>();
  const [states, setStates] = useState<States>({
    curId: [],
    children1: [],
    children2: [],
    children3: [],
    categoryData: []
  });

  useEffect(() => {
    getAllCategories();
  }, []);

  /**
   * get next level children in data by `id`.
   * @param id
   * @param data
   */
  const getChildren = (id: string, data: any) => {
    if (!data || !data.length) {
      return;
    }
    data.forEach((item: any) => {
      if (item.id === parseInt(id, 10)) {
        categoryTemp = item.subCategory;
      } else {
        return getChildren(id, item.subCategory);
      }
      return categoryTemp;
    });
  }

  // get all categories data in json string.
  const getAllCategories = async () => {
    const data = await BlogServices.getAllCategories().catch((e: any) => message.error(`错误：${e}`));
    if (data.success) {
      let children = data.data.map((item: any) => <Option key={item.id}>{item.name}</Option>);
      setStates(prev => ({ ...prev, children1: children, categoryData: data.data }));
      children = null;
    } else {
      message.warning(data.msg);
    }
  }

  const handleChange1 = (value: any) => {
    const { curId } = states;
    const childrenIn = handleChangeInner(value);
    setStates(prev => ({ ...prev, children2: childrenIn }));
    if (parseInt(value, 10)) {
      curId.splice(
        0 /* start position */,
        curId.length /* delete count */,
        value /* insert value */
      );
      setStates(prev => ({ ...prev, curId }));
    } else {
      // set first `curId` item as a default value `0` when `value` equals `0`.
      setStates(prev => ({ ...prev, curId: [0] }));
    }
  };

  const handleChange2 = (value: any) => {
    const { curId } = states;
    const childrenIn = handleChangeInner(value);
    setStates(prev => ({ ...prev, children3: childrenIn }));
    if (parseInt(value, 10)) {
      curId.splice(1, curId.length - 1, value);
      setStates(prev => ({ ...prev, curId }));
    } else {
      // push the last item of `curId` array as a new item into
      // `curId` when `value` param equals `0`.
      setStates(prev => ({ ...prev, curId: curId.concat(curId[curId.length - 1]) }));
    }
  };

  const handleChange3 = (value: any) => {
    const { curId } = states;
    if (parseInt(value, 10)) {
      curId.splice(2, curId.length - 2, value);
      setStates(prev => ({ ...prev, curId: curId }));
    } else {
      // push the last item of `curId` array as a new item into
      // `curId` when `value` param equals `0`.
      setStates(prev => ({ ...prev, curId: curId.concat(curId[curId.length - 1]) }));
      categoryModal.current?.setStates({ visible: true });
      categoryModal.current?.setStates({ categoryName: '' });
    }
  };

  const delCategory = async () => {
    const { curId } = states;
    const data = await BlogServices.deleteCategory(curId[curId.length - 1]).catch(e => message.error(`错误：${e}`));
    if (data.success) {
      message.warning('删除成功');
    } else {
      message.warning(data.msg);
    }
  };

  const handleChangeInner = (value: string) => {
    const childrenIn: JSX.Element[] = [];
    if (parseInt(value, 10)) {
      const { categoryData } = states;
      getChildren(value, categoryData);
      if (categoryTemp) {
        categoryTemp && categoryTemp.forEach((item: any) =>
          childrenIn.push(
            <Option key={`${item.id}s`} value={item.id}>
              {item.name}
            </Option>
          )
        );
      }
      return childrenIn;
    }
    // refs下的属性首字母必须小写：categoryModal
    categoryModal.current?.setStates({ visible: true });
    categoryModal.current?.setStates({ categoryName: '' });
    return childrenIn;
  }

  const { children1, children2, children3, curId } = states;
  return (
    <div className="CategoryManage">
      <div className="category-item">
        <section>一级类目：</section>
        <Select placeholder="请选择" onSelect={handleChange1} style={{ width: 300 }}>
          <Option key={0}>添加</Option>
          {children1}
        </Select>
        <Button style={{ margin: '0 10px' }} onClick={delCategory}>
          删除
        </Button>
      </div>
      <div className="category-item">
        <section>二级类目：</section>
        <Select placeholder="请选择" onSelect={handleChange2} style={{ width: 300 }}>
          <Option key={0}>添加</Option>
          {children2}
        </Select>
        <Button style={{ margin: '0 10px' }} onClick={delCategory}>
          删除
        </Button>
      </div>
      <div className="category-item">
        <section>三级类目：</section>
        <Select placeholder="请选择" onSelect={handleChange3} style={{ width: 300 }}>
          <Option key={0}>添加</Option>
          {children3}
        </Select>
        <Button style={{ margin: '0 10px' }} onClick={delCategory}>
          删除
        </Button>
      </div>
      {/* <div className="category-item"> */}
      {/* <Button style={{width: 300}} type="primary" onClick={this.handleSubmit}>提交</Button> */}
      {/* </div> */}
      {curId.length && (
        <CategoryModal
          ref={categoryModal}
          data={{ level: curId.length, categoryId: curId[curId.length - 1] }}
        />
      )}
    </div>
  );
}

export default Index;
