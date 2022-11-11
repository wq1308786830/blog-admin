import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Cascader, DatePicker, Input, List, message, Popconfirm, Spin } from 'antd';
import AdminServices from '@/services/AdminServices';
import BlogServices from '@/services/BlogServices';
import './index.scss';

interface States {
  loading: boolean;
  loadingMore: boolean;
  showLoadingMore: boolean;
  category: [];
  data: {
    id: any;
    category_id: any;
    title: string;
    description: string;
  }[];
  pageIndex: number;
  options: [];
  cOptions: {
    categoryId: string;
    dateRange: any;
    text: string;
  };
}

/**
 * The recursive function to change option's key name.
 * @param data:input option array data.
 * @param optionData:output option array data.
 * @returns optionData: output option array data.
 */
const handleOptions = (data: any, optionData: any) => {
  const newOptionData = optionData;
  for (let i = 0; i < data.length; i += 1) {
    newOptionData[i] = { value: data[i].id, label: data[i].name };
    if (data[i].subCategory && data[i].subCategory.length) {
      handleOptions(data[i].subCategory, (newOptionData[i].children = []));
    }
  }
  return optionData;
};

function Index() {
  const [states, setStates] = useState<States>({
    loading: false,
    loadingMore: false,
    showLoadingMore: true,
    category: [],
    data: [],
    pageIndex: 0,
    options: [],
    cOptions: {
      categoryId: '',
      dateRange: [],
      text: '',
    },
  });

  // get category select options data.
  const getAllCategories = async () => {
    const resp = await BlogServices.getAllCategories().catch((err: any) =>
      message.error(`错误：${err}`)
    );
    if (resp.success) {
      setStates((prev) => ({
        ...prev,
        options: handleOptions(resp.data, []),
      }));
    } else {
      message.warning(resp.msg);
    }
  };

  /**
   *  get articles by conditions in data `option` and page number pageIndex.
   *  callback function will deal response data.
   */
  const getArticlesData = async (option: any, pageIndex: number, callback: Function) => {
    setStates((prev) => ({ ...prev, loading: true }));
    const resp = await AdminServices.getArticles(option, pageIndex).catch((err: any) => {
      setStates((prev) => ({ ...prev, loading: false }));
      return message.error(`错误：${err}`);
    });
    setStates((prev) => ({ ...prev, loading: false }));
    if (resp.success) {
      callback(resp.data);
    } else {
      callback([]);
    }
  };

  useEffect(() => {
    getAllCategories();
    getArticlesData([], 0, (res: any) => {
      if (res.length < 2) {
        setStates((prev) => ({
          ...prev,
          showLoadingMore: false,
          loading: false,
          data: res,
        }));
      }
    });
  }, []);

  // change pageIndex number and needSelect status when selected condition changes.
  const changeSelectState = () => {
    const { pageIndex } = states;
    if (pageIndex > 0) {
      setStates((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  };

  const onCascaderChange = (value: any[]) => {
    changeSelectState();
    setStates((prev: any) => ({
      ...prev,
      category: value,
      cOptions: { ...prev.cOptions, categoryId: value[value.length - 1] },
    }));
  };

  const onRangePickerChange = (dates: any) => {
    changeSelectState();
    setStates((prev: any) => ({
      ...prev,
      dateRange: dates,
      cOptions: {
        ...prev.cOptions,
        dateRange: [dates[0].unix(), dates[1].unix()],
      },
    }));
  };

  const onInputChange = (e: any) => {
    e.persist();
    const { cOptions } = states;
    changeSelectState();
    setStates((prev) => ({
      ...prev,
      text: e.target.value,
      cOptions: { ...cOptions, text: e.target.value },
    }));
  };

  const onSearchClick = () => {
    const { cOptions, pageIndex } = states;
    getArticlesData(cOptions, pageIndex, (res: any) => {
      if (res.length < 2) {
        setStates((prev) => ({ ...prev, showLoadingMore: false }));
      }
      setStates((prev) => ({
        ...prev,
        showLoadingMore: true,
        loading: false,
        data: res,
      }));
    });
  };

  // handle load more button click event.
  const onLoadMore = () => {
    const { cOptions, data, pageIndex } = states;
    setStates((prev) => ({
      ...prev,
      loadingMore: true,
      pageIndex: pageIndex + 1,
    }));
    getArticlesData(cOptions, pageIndex, (res: any) => {
      if (res.length < 2) {
        setStates((prev) => ({
          ...prev,
          pageIndex: pageIndex - 1,
          showLoadingMore: false,
        }));
      }
      const moreData: any = data.concat(res);
      setStates((prev) => ({
        ...prev,
        loadingMore: false,
        data: moreData,
      }));
      window.dispatchEvent(new Event('resize'));
    });
  };

  const confirm = async (article: any) => {
    const { data } = states;
    const resp = await AdminServices.deleteArticle(article.id).catch((err: any) =>
      message.error(`错误：${err}`)
    );
    if (resp.success) {
      const deletedItem: any = data.filter((item: any) => item.id !== article.id);
      setStates((prev) => ({
        ...prev,
        data: deletedItem,
      }));
      message.success(`博文${article.title}，删除成功！`);
    }
  };

  const loadMore = states.showLoadingMore ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      {states.loadingMore && <Spin />}
      {!states.loadingMore && states.data.length ? (
        <Button onClick={onLoadMore}>加载更多</Button>
      ) : null}
    </div>
  ) : (
    <div className="ant-list-empty-text">没更多数据了</div>
  );

  return (
    <div>
      <Input.Group compact style={{ textAlign: 'center', paddingBottom: '2em' }}>
        <Cascader
          value={states.category}
          style={{ width: 300 }}
          options={states.options}
          placeholder="类目"
          onChange={onCascaderChange}
          changeOnSelect
        />
        <DatePicker.RangePicker
          name="dateRange"
          value={states.cOptions.dateRange}
          onChange={onRangePickerChange}
          placeholder={['开始时间', '截止时间']}
        />
        <Input
          name="text"
          value={states.cOptions.text}
          placeholder="模糊搜索"
          onChange={onInputChange}
          style={{ width: 200 }}
        />
        <Button type="primary" icon="search" onClick={onSearchClick}>
          过滤
        </Button>
      </Input.Group>
      <List
        className="demo-loadmore-list"
        loading={states.loading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={states.data}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Link
                state={{ articleDetail: item, category: states.category, options: states.options }}
                to={`/articleEdit/${item.category_id}/${item.id}`}
              >
                编辑
              </Link>,
              <Popconfirm
                title="确定要删除吗?"
                onConfirm={() => confirm(item)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link">删除</Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={
                <Link
                  to={`/category/${item.category_id}/articles/${item.id}/detail`}
                  target="_blank"
                >
                  {item.title}
                </Link>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default Index;
