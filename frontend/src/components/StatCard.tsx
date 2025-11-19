import { Card } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: number | string;
}

interface StatCardProps {
  items: StatItem[];
  className?: string;
}

const StatCard = ({ items, className }: StatCardProps) => {
  return (
    <Card
      className={`flex flex-row items-center justify-center p-4 gap-6 ${className}`}
    >
      {items.map((item, index) => (
        <div key={index} className="flex flex-row items-center gap-6">
          {/* Stat content */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold">{item.value}</h1>
            <p className="text-sm font-extralight">{item.label}</p>
          </div>

          {/* Vertical Separator — but NOT after last item */}
          {index < items.length - 1 && (
            <div className="w-px bg-border self-stretch" />
          )}
        </div>
      ))}
    </Card>
  );
};

export default StatCard;
