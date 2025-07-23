type buttonProps = {
  isLoading: boolean;
  error: boolean;
  onClick: () => {};
};

export default function AIButton({ isLoading, error, onClick }: buttonProps) {
  if (isLoading) {
    return (
      <div className="mb-6 cursor">
        Summarize
      </div>
    );
  }
  if (error) {
    return (
      <div className="mb-6" onClick={onClick}>
        Summarize
      </div>
    );
  }
  return (
    <div className="mb-6" onClick={onClick}>
      Summarize
    </div>
  );
}
