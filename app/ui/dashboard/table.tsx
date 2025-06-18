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
import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { Skeleton } from "@/app/ui/skeleton";

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
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
  editUrl?: (item: T) => string;
  deleteUrl?: (item: T) => string;
  displayNameField?: keyof T;
  isLoading?: boolean;
  skeletonRows?: number;
  meta?: MetaData;
  onPageChange?: (page: number) => void;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export default function ReusableTable<T extends { id: string | number }>({
  columns,
  data,
  caption,
  showActions = false,
  onEdit,
  onDelete,
  editUrl = (item) => `/edit/${item.id}`,
  deleteUrl = (item) => `/delete/${item.id}`,
  displayNameField,
  isLoading = false,
  skeletonRows = 5,
  meta,
  onPageChange,
  onSearchChange,
  searchPlaceholder,
}: ReusableTableProps<T>) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

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
        <TableRow key={`skeleton-row-${rowIndex}`}>
          <TableCell>
            <Skeleton className="h-4 w-4" />
          </TableCell>
          {Array(visibleColumns)
            .fill(0)
            .map((_, colIndex) => (
              <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          {showActions && (
            <TableCell>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </TableCell>
          )}
        </TableRow>
      ));
  };

  return (
    <>
      {onSearchChange && (
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder={searchPlaceholder || "Cari..."}
            className="border px-3 py-2 rounded-md text-sm"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            {columns
              .filter((col) => col.key !== "id")
              .map((col) => (
                <TableHead key={String(col.key)}>{col.label}</TableHead>
              ))}
            {showActions && <TableHead>Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            renderSkeletonRows()
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                {columns
                  .filter((col) => col.key !== "id")
                  .map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render ? (
                        col.render(item[col.key], item)
                      ) : (
                        String(item[col.key])
                      )}
                    </TableCell>
                  ))}
                {showActions && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={editUrl(item)}>
                        <Button size="sm" variant="outline" onClick={() => onEdit?.(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}

          {!isLoading && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={totalColumns} className="text-center py-8 text-gray-500">
                Tidak ada data yang tersedia
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Menampilkan {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} item
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToFirstPage} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Halaman {currentPage} dari {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              {itemToDelete ? getItemDisplayName(itemToDelete) : "data"} ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Ya, Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
