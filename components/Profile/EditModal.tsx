import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { useState } from "react";

interface EditModalProps {
  isOpenModal: boolean;
  setIsOpenModal: (open: boolean) => void;
  className?: string;
  headerClassName?: string;
  title?: React.ReactNode;
  titleClassName?: string;
  description?: React.ReactNode;
  descriptionClassName?: string;
  body?: React.ReactNode;
  footerClassName?: string;
  cancelButton?: string;
  cancelButtonClassName?: string;
  confirmButton?: string;
  confirmButtonClassName?: string;
  confirmButtonDisabled?: boolean;
  onConfirm?: (input: any) => void;
  onCancel?: () => void;
}

const EditModal = ({
  isOpenModal,
  setIsOpenModal,
  className,
  headerClassName,
  title,
  titleClassName,
  description,
  descriptionClassName,
  body,
  footerClassName,
  cancelButton,
  cancelButtonClassName,
  confirmButton,
  confirmButtonClassName,
  confirmButtonDisabled = false,
  onConfirm,
  onCancel,
}: EditModalProps) => {
  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogContent
        className={clsx("w-[60vw] !max-w-[60vw] h-fit", className)}
      >
        <DialogHeader className={clsx(headerClassName)}>
          <DialogTitle className={clsx(titleClassName)}>{title}</DialogTitle>
          <DialogDescription className={clsx(descriptionClassName)}>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex flex-col">{body}</div>
        <DialogFooter className={clsx(footerClassName)}>
          {cancelButton && (
            <Button className={clsx(cancelButtonClassName)} onClick={onCancel}>
              {cancelButton}
            </Button>
          )}
          {confirmButton && (
            <Button
              className={clsx(confirmButtonClassName)}
              onClick={onConfirm}
              disabled={confirmButtonDisabled}
            >
              {confirmButton}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
