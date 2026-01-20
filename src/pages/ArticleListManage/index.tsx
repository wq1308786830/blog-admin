import { useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Cascader, DatePicker, Input, List, Popconfirm, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useCategories, useArticleActions, useArticleList } from '@/hooks';
import { Article, ArticleFilters } from '@/types';
import './index.scss';

function Index() {
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isPending, startTransition] = useTransition();

  // Build filters object
  const filters: ArticleFilters = {
    categoryId: selectedCategory.length > 0 ? String(selectedCategory[selectedCategory.length - 1]) : '',
    dateRange: dateRange ? [dateRange[0].unix(), dateRange[1].unix()] : [],
    text: searchText,
  };

  // Fetch categories
  const { data: categoryOptions = [] } = useCategories();

  // Fetch articles with infinite scroll
  const {
    data: articlesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useArticleList(filters);

  // Flatten articles from all pages
  const articles = articlesData?.pages.flat() || [];

  // Article actions
  const { deleteArticle } = useArticleActions();

  // Handler functions with useTransition for non-urgent updates
  const onCascaderChange = (value: (string | number)[]) => {
    startTransition(() => {
      const numericValues = value.map(Number);
      setSelectedCategory(numericValues);
    });
  };

  const onRangePickerChange = (dates: null | [Dayjs | null, Dayjs | null]) => {
    startTransition(() => {
      if (dates && dates[0] && dates[1]) {
        setDateRange([dates[0], dates[1]]);
      } else {
        setDateRange(null);
      }
    });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchText(e.target.value);
    });
  };

  const onLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleDelete = (article: Article) => {
    deleteArticle(article.id);
  };

  // Convert dateRange back to DatePicker format
  const datePickerValue = dateRange
    ? [dayjs.unix(Number(dateRange[0])), dayjs.unix(Number(dateRange[1]))]
    : null;

  const loadMore = hasNextPage ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      {isFetchingNextPage && <Spin />}
      {!isFetchingNextPage && articles.length > 0 && (
        <Button onClick={onLoadMore} disabled={isFetchingNextPage}>
          加载更多
        </Button>
      )}
    </div>
  ) : (
    <div className="ant-list-empty-text">没更多数据了</div>
  );

  return (
    <div>
      {isPending && (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <Spin tip="加载中..." />
        </div>
      )}
      <Input.Group compact style={{ textAlign: 'center', paddingBottom: '2em' }}>
        <Cascader
          style={{ width: 300 }}
          options={categoryOptions}
          placeholder="类目"
          onChange={onCascaderChange}
          changeOnSelect
          allowClear
        />
        <DatePicker.RangePicker
          name="dateRange"
          value={(datePickerValue ?? undefined) as [Dayjs, Dayjs] | undefined}
          onChange={onRangePickerChange}
          placeholder={['开始时间', '截止时间']}
          allowClear
        />
        <Input
          name="text"
          value={searchText}
          placeholder="模糊搜索"
          onChange={onInputChange}
          style={{ width: 200 }}
        />
        <Button type="primary" disabled>
          过滤 (自动)
        </Button>
      </Input.Group>
      <List
        className="demo-loadmore-list"
        loading={isLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={articles}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Link
                state={{ articleDetail: item, category: selectedCategory, options: categoryOptions }}
                to={`/articleEdit/${item.category_id}/${item.id}`}
              >
                编辑
              </Link>,
              <Popconfirm
                title="确定要删除吗?"
                onConfirm={() => handleDelete(item)}
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
