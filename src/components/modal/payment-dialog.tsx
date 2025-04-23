"use client";

import { FC, Dispatch, SetStateAction } from "react";

// Components
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Icons
import { IcoSuccess } from "@/assets/icon";

// Types
interface PaymentDialogProps {
  setClose: Dispatch<SetStateAction<boolean>>;
  userName?: string;
  tokenNumber?: string;
  orderNumber?: string;
  totalAmount?: number;
  open: boolean;
}

const PaymentDialog: FC<PaymentDialogProps> = ({
  setClose,
  userName = "Mathew",
  tokenNumber = "321",
  orderNumber = "MFP54568",
  totalAmount = 295,
  open,
}) => {
  const handleGoBack = () => {
    setClose(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="!max-w-[358px] rounded-2xl logout-dialog bg-white"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <IcoSuccess />
        </div>

        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-center text-sm text-muted-foreground">
            Hey {userName}.
          </DialogTitle>
          <Typography variant="Bold_H5" className="text-center block !text-lg ">
            Order confirmed
          </Typography>
          <DialogDescription className="text-center !text-sm text-muted-foreground mt-4">
            Here&apos;s your token number. Please collect your food at the
            counter.
          </DialogDescription>
        </DialogHeader>

        {/* Order Details */}
        <div className="border rounded-lg p-4 my-4">
          <div className="flex justify-between items-center">
            <Typography variant="Regular_H5" className="text-muted-foreground">
              Token no
            </Typography>
            <Typography variant="Bold_H3" className="text-primary">
              #{tokenNumber}
            </Typography>
          </div>

          <div className="flex justify-between items-center mb-2">
            <Typography variant="Regular_H5" className="text-muted-foreground">
              Order no
            </Typography>
            <Typography variant="Medium_H5">{orderNumber}</Typography>
          </div>

          <div className="flex justify-between items-center">
            <Typography variant="Regular_H5" className="text-muted-foreground">
              Total amount
            </Typography>
            <Typography variant="Medium_H5">
              ₹{totalAmount.toFixed(2)}
            </Typography>
          </div>
        </div>

        {/* Go Back Button */}
        <DialogFooter className="flex-col">
          <Button
            variant="default"
            onClick={handleGoBack}
            className="w-full text-lg h-12"
          >
            Go Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
