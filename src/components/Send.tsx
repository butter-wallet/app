import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import SendDrawerContent from './SendDrawerContent';

export default function Send() {
  return (
    <div className="flex items-center justify-center">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="lg">
            Send
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <SendDrawerContent />
        </DrawerContent>
      </Drawer>
    </div>
  );
}