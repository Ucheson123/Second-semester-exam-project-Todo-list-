import React from "react";
import { useForm } from "@tanstack/react-form";

const UploadTodo = () => {
  const form = useForm({
    defaultValues: { name: "", status: "TODO" },
    onSubmit: async ({ value }) => {
      try {
        const token = localStorage.getItem("token")
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
        }
      } catch (error) {
        console.error("Failed to submit", error);
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
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="form-group">
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="E.g., Finish React Exam"
                />
                {!field.state.meta.isValid && (
                  <em className="error-text" role="alert">
                    {field.state.meta.errors.join(",")}
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