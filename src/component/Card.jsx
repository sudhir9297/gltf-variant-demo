export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white border rounded-xl shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
