import { type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200/60 rounded-md ${className}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-sm" />
            <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
            </div>
        </div>
    );
}

export function CategorySkeleton() {
    return (
        <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-full aspect-square rounded-[24px]" />
            <Skeleton className="h-5 w-1/2" />
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 flex gap-6">
                <div className="hidden md:flex flex-col gap-3 w-20">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[4/5] w-full" />)}
                </div>
                <Skeleton className="flex-1 aspect-[4/5]" />
            </div>
            <div className="lg:col-span-5 space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-14 w-full" />
            </div>
        </div>
    );
}
