import { useState, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { useCategories, useArticleActions, useArticleList } from '@/hooks';
import { Article, ArticleFilters } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader } from '@/components/ui/loader';
import { CascaderSelect } from '@/components/form/CascaderSelect';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { CascaderOption } from '@/components/form/CascaderSelect';
import { DateRangePicker } from '@/components/form/DateRangePicker';
import { subDays } from 'date-fns/subDays';

function Index() {
  const [selectedCategory, setSelectedCategory] = useState<(string | number)[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchText, setSearchText] = useState('');
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  // Build filters object
  const filters: ArticleFilters = {
    categoryId: selectedCategory.length > 0 ? String(selectedCategory[selectedCategory.length - 1]) : '',
    dateRange: dateRange && dateRange.from && dateRange.to ? [
      Math.floor(dateRange.from.getTime() / 1000),
      Math.floor(dateRange.to.getTime() / 1000)
    ] : [],
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
      setSelectedCategory(value);
    });
  };

  const onRangePickerChange = (range: DateRange | undefined) => {
    startTransition(() => {
      setDateRange(range);
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

  const handleDelete = () => {
    if (deleteTarget) {
      deleteArticle(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="flex justify-center py-2.5">
          <Loader size="sm" />
        </div>
      )}

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-2 pb-8">
        <CascaderSelect
          options={categoryOptions as CascaderOption[]}
          value={selectedCategory}
          onChange={onCascaderChange}
          placeholder="类目"
          className="w-[300px]"
        />
        <DateRangePicker
          value={dateRange}
          onChange={onRangePickerChange}
          presets={[
            {
              label: '最近7天',
              value: [subDays(new Date(), 7), new Date()]
            },
            {
              label: '最近30天',
              value: [subDays(new Date(), 30), new Date()]
            }
          ]}
        />
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchText}
            placeholder="模糊搜索"
            onChange={onInputChange}
            className="w-[200px] pl-9"
          />
        </div>
        <Button type="button" disabled>
          过滤 (自动)
        </Button>
      </div>

      {/* Articles List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader size="lg" text="加载中..." />
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4 pr-4">
            {articles.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/category/${item.category_id}/articles/${item.id}/detail`}
                    target="_blank"
                    className="text-lg font-medium hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    state={{
                      articleDetail: item,
                      category: selectedCategory,
                      options: categoryOptions,
                    }}
                    to={`/articleEdit/${item.category_id}/${item.id}`}
                  >
                    <Button variant="ghost" size="sm">
                      编辑
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                      >
                        删除
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                          确定要删除这篇文章 "{item.title}" 吗？此操作无法撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
                          取消
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          确定
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}

            {/* Load More Section */}
            {articles.length > 0 && (
              <div className="flex justify-center pt-4">
                {isFetchingNextPage ? (
                  <Loader size="sm" />
                ) : hasNextPage ? (
                  <Button onClick={onLoadMore} variant="outline">
                    加载更多
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">没更多数据了</p>
                )}
              </div>
            )}

            {articles.length === 0 && !isLoading && (
              <div className="text-center py-12 text-muted-foreground">
                <ScrollText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>暂无数据</p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default Index;
