// app/ui/dashboard/table.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/app/ui/skeleton";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface MetaData {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

interface ReusableTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  caption?: string;
  showActions?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  editUrl?: (item: T) => string;
  deleteUrl?: (item: T) => string;
  viewUrl?: (item: T) => string;
  displayNameField?: keyof T;
  isLoading?: boolean;
  skeletonRows?: number;
  meta?: MetaData;
  onPageChange?: (page: number) => void;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  title?: string;
  description?: string;
  onRefresh?: () => void;
  onExport?: () => void;
}

export default function ReusableTable<T extends { id: string | number }>({
  columns,
  data,
  caption,
  showActions = false,
  onEdit,
  onDelete,
  onView,
  editUrl = (item) => `/edit/${item.id}`,
  deleteUrl = (item) => `/delete/${item.id}`,
  viewUrl = (item) => `/view/${item.id}`,
  displayNameField,
  isLoading = false,
  skeletonRows = 5,
  meta,
  onPageChange,
  onSearchChange,
  searchPlaceholder,
  title,
  description,
  onRefresh,
  onExport,
}: ReusableTableProps<T>) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const pageSize = meta?.per_page ?? 10;
  const currentPage = meta?.current_page ?? 1;
  const totalItems = meta?.total ?? 0;
  const totalPages = meta?.total_pages ?? Math.ceil(totalItems / pageSize);

  const getItemDisplayName = (item: T): string => {
    if (displayNameField && displayNameField in item) {
      return String(item[displayNameField]);
    }

    const firstNonIdColumn = columns.find((col) => col.key !== "id");
    if (firstNonIdColumn) {
      return String(item[firstNonIdColumn.key]);
    }

    return `ID: ${String(item.id)}`;
  };

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete);
    }
    setIsAlertOpen(false);
    setItemToDelete(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const visibleColumns = columns.filter((col) => col.key !== "id").length;
  const totalColumns = visibleColumns + 1 + (showActions ? 1 : 0);

  const goToFirstPage = () => onPageChange && onPageChange(1);
  const goToPreviousPage = () => onPageChange && onPageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => onPageChange && onPageChange(totalPages);

  const renderSkeletonRows = () => {
    return Array(skeletonRows)
      .fill(0)
      .map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`} className="hover:bg-gray-50/50">
          <TableCell className="w-16">
            <Skeleton className="h-4 w-8" />
          </TableCell>
          {Array(visibleColumns)
            .fill(0)
            .map((_, colIndex) => (
              <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                <Skeleton className="h-4 w-full max-w-[200px]" />
              </TableCell>
            ))}
          {showActions && (
            <TableCell className="w-32">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </TableCell>
          )}
        </TableRow>
      ));
  };

  return (
    <div className="w-full space-y-4">
      {/* ✅ Enhanced Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              {title && (
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {title}
                </CardTitle>
              )}
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </div>

            {/* ✅ Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>

          {/* ✅ Enhanced Search & Filters */}
          {onSearchChange && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder || "Cari data..."}
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 h-10"
                />
              </div>
              
              {/* ✅ Optional Filter Button */}
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          )}

          {/* ✅ Stats Bar */}
          {!isLoading && totalItems > 0 && (
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                Total: {totalItems.toLocaleString()}
              </Badge>
              <Badge variant="outline">
                Halaman {currentPage} dari {totalPages}
              </Badge>
              {searchValue && (
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Hasil pencarian: "{searchValue}"
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4">
          {/* ✅ Responsive Table Container */}
          <div className="overflow-x-auto">
            <Table>
              {caption && <TableCaption className="mt-4">{caption}</TableCaption>}
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50">
                  <TableHead className="w-16 font-semibold text-gray-900">No</TableHead>
                  {columns
                    .filter((col) => col.key !== "id")
                    .map((col) => (
                      <TableHead 
                        key={String(col.key)} 
                        className={`font-semibold text-gray-900 ${col.className || ''}`}
                      >
                        <div className="flex items-center gap-2">
                          {col.label}
                          {col.sortable && (
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                              ⇅
                            </Button>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  {showActions && (
                    <TableHead className="w-32 font-semibold text-gray-900">Aksi</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletonRows()
                ) : (
                  data.map((item, index) => (
                    <TableRow 
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors duration-150 border-b border-gray-100"
                    >
                      <TableCell className="font-medium text-gray-600">
                        {(currentPage - 1) * pageSize + index + 1}
                      </TableCell>
                      {columns
                        .filter((col) => col.key !== "id")
                        .map((col) => (
                          <TableCell 
                            key={String(col.key)}
                            className={`${col.className || ''}`}
                          >
                            {col.render ? (
                              col.render(item[col.key], item)
                            ) : (
                              <span className="text-gray-900">
                                {String(item[col.key])}
                              </span>
                            )}
                          </TableCell>
                        ))}
                      {showActions && (
                        <TableCell>
                          <div className="flex gap-1">
                            {/* ✅ Mobile: Dropdown Menu */}
                            <div className="sm:hidden">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {onView && (
                                    <DropdownMenuItem asChild>
                                      <Link href={viewUrl(item)}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Lihat
                                      </Link>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem asChild>
                                    <Link href={editUrl(item)}>
                                      <Pencil className="w-4 h-4 mr-2" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(item)}
                                    className="text-red-600"
                                  >
                                    <Trash className="w-4 h-4 mr-2" />
                                    Hapus
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* ✅ Desktop: Individual Buttons */}
                            <div className="hidden sm:flex gap-1">
                              {onView && (
                                <Link href={viewUrl(item)}>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => onView?.(item)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                              )}
                              <Link href={editUrl(item)}>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                  onClick={() => onEdit?.(item)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(item)}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}

                {!isLoading && data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={totalColumns} className="py-12">
                      <div className="text-center space-y-3">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">Tidak ada data</p>
                          <p className="text-gray-500 text-sm">
                            {searchValue 
                              ? `Tidak ditemukan hasil untuk "${searchValue}"`
                              : "Belum ada data yang tersedia"
                            }
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ✅ Enhanced Pagination */}
          {totalPages > 0 && (
            <div className="border-t bg-gray-50/50 px-4 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                  Menampilkan{" "}
                  <span className="font-medium text-gray-900">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium text-gray-900">
                    {Math.min(currentPage * pageSize, totalItems)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium text-gray-900">
                    {totalItems.toLocaleString()}
                  </span>{" "}
                  item
                </div>
                
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToFirstPage} 
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToPreviousPage} 
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="px-3 py-1 text-sm font-medium bg-white border rounded-md min-w-[100px] text-center">
                    {currentPage} / {totalPages}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ Enhanced Delete Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Trash className="w-4 h-4 text-red-600" />
              </div>
              Konfirmasi Hapus
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-medium text-gray-900">
                {itemToDelete ? getItemDisplayName(itemToDelete) : "data"}
              </span>{" "}
              ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}