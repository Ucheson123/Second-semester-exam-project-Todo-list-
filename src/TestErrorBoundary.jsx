// A component that intentionally crashes when you visit it
const TestErrorBoundary = () => {
  throw new Error("This component is created to test error boundaries.");
  return <div>You will never see this</div>;
};

export default TestErrorBoundary;