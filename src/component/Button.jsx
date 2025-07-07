export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
