import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Avatar, Button, Cascader, DatePicker, Input, List, message, Popconfirm, Spin } from 'antd';
import AdminServices from '@/services/AdminServices';
import BlogServices from '@/services/BlogServices';
import './index.scss';
import { handleOptions } from '@/utils/tools';

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
  // options: [];
  cOptions: {
    categoryId: string;
    dateRange: any;
    text: string;
  };
}

function Index() {
  const [states, setStates] = useState<States>({
    loading: false,
    loadingMore: false,
    showLoadingMore: true,
    category: [],
    data: [],
    pageIndex: 0,
    // options: [],
    cOptions: {
      categoryId: '',
      dateRange: [],
      text: '',
    },
  });

  // get category select options data.
  const getAllCategories = async () => {
    const resp: any = await BlogServices.getAllCategories().catch((err: any) =>
      message.error(`错误：${err}`)
    );
    if (resp.success) {
      return handleOptions(resp.data, []);
    }
    message.warning(resp.msg);
    return [];
  };

  /**
   *  get articles by conditions in data `option` and page number pageIndex.
   *  callback function will deal response data.
   */
  const getArticlesData = async (queryKey: any[]) => {
    setStates((prev) => ({ ...prev, showLoadingMore: true, loadingMore: true }));
    const resp: any = await AdminServices.getArticles(queryKey[0], queryKey[1]).catch((err: any) =>
      message.error(`错误：${err}`)
    );
    if (resp.success) {
      if (resp.data.length) {
        setStates((prev) => ({
          ...prev,
          showLoadingMore: true,
          data: [...prev.data, ...resp.data],
          loadingMore: false,
          pageIndex: prev.pageIndex + 1,
        }));
      } else {
        setStates((prev) => ({
          ...prev,
          showLoadingMore: false,
          loadingMore: false,
        }));
      }
    }
  };

  useEffect(() => {
    getArticlesData([states.cOptions, states.pageIndex]);
  }, []);

  const { data: options } = useQuery('getAllCategories', getAllCategories);

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
      cOptions: { ...prev.cOptions, categoryId: value ? value[value.length - 1] : '' },
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
    const { cOptions } = states;
    setStates((prev) => ({
      ...prev,
      data: [],
      pageIndex: 0,
    }));
    getArticlesData([cOptions, 0]);
  };

  // handle load more button click event.
  const onLoadMore = () => {
    const { cOptions, pageIndex } = states;
    setStates((prev) => ({
      ...prev,
      loadingMore: true,
      pageIndex: pageIndex + 1,
    }));
    getArticlesData([cOptions, pageIndex]);
  };

  const confirm = async (article: any) => {
    const { data } = states;
    const resp: any = await AdminServices.deleteArticle(article.id).catch((err: any) =>
      message.error(`错误：${err}`)
    );
    if (resp.success) {
      const deletedItem: any = data.filter((item: any) => item.id !== article.id);
      setStates((prev) => ({
        ...prev,
        data: deletedItem,
      }));
      message.success(`文章：${article.title}，删除成功！`);
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
          options={options}
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
        loading={states.loadingMore}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={states.data}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Link
                state={{ articleDetail: item, category: states.category, options }}
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
