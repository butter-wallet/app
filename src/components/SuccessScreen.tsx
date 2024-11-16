import { Check } from 'lucide-react';

const SuccessScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;