import React from "react";
import { useForm } from "@tanstack/react-form";

export interface TodoFormValues {
  name: string;
  status: "TODO" | "DONE";
}

const UploadTodo: React.FC = () => {
  const form = useForm({
    defaultValues: { name: "", status: "TODO" } as TodoFormValues,
    
    onSubmit: async ({ value }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://api.oluwasetemi.dev/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(value),
        });
        
        if (response.ok) {
          form.reset();
        } else {
          console.error("Server responded with an error status:", response.status);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to submit:", error.message);
        } else {
          console.error("An unknown error occurred during submission.");
        }
      }
    },
  });

  return (
    <section className="upload-section">
      <header>
        <h2>Add a new task</h2>
      </header>
      <form
        className="inline-form"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="form-group">
          {/* Because <TodoFormValues> has been used, if i change name="name" to name="title", TS will throw an error */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => !value ? "A task name is required" : undefined,
            }}
            children={(field) => (
              <>
                <label htmlFor={field.name}>Task Description</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(e.target.value)}
                  placeholder="E.g., Finish React Exam"
                />
                {/* i added a length check to ensure we only try to join errors if they exist */}
                {!field.state.meta.isValid && field.state.meta.errors.length > 0 && (
                  <em className="error-text" role="alert">
                    {field.state.meta.errors.join(", ")}
                  </em>
                )}
              </>
            )}
          />
        </div>
        
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          )}
        />
      </form>
    </section>
  );
};

export default UploadTodo;