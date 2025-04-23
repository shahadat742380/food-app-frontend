"use client";

import { FC, Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation"; // Routing for redirection

// Components
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Auth client
import { authClient } from "@/lib/auth-client";
import { IcoLogout } from "@/assets/icon";

// Types
interface PopupProps {
  setClose: Dispatch<SetStateAction<boolean>>;
}

const LogoutDialog: FC<PopupProps> = ({ setClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true); // Start loading state
    try {
      await authClient.signOut();
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error during logout:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <DialogContent className="!max-w-[358px] logout-dialog">
      {/* Dialog Header */}
      <DialogHeader>
        <div className="flex justify-center mb-4">
          <IcoLogout />
        </div>
        <DialogTitle className="md:text-xl text-primary font-bold text-center">
          Confirmation!
        </DialogTitle>
        <DialogDescription>
          <Typography variant="Medium_H5" className="block text-center mt-6">
            Are you sure you want to Logout?
          </Typography>
        </DialogDescription>
      </DialogHeader>

      {/* Dialog Footer */}
      <DialogFooter className="grid grid-cols-2 gap-6 mt-8">
        <Button
          onClick={() => setClose(false)}
          variant="outline"
          className="md:text-base text-primary"
        >
          Cancel
        </Button>
        <Button
          onClick={logout}
          className="md:text-base"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Logging out..." : "Log out"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default LogoutDialog;
