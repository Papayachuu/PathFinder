export default function EmptyState({ text, action, actionLabel }) {
  return (
    <div className="as-card p-8 text-center max-w-md">
      <p className="as-muted text-sm mb-4">{text}</p>
      {action && (
        <button onClick={action} className="as-btn-primary px-4 py-2 text-sm font-medium">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
