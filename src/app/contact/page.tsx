import React from "react";

export default function ContactPage(props: any) {
  // props.searchParams may be undefined or an object provided by Next
  const searchParams = props?.searchParams as any;
  const subject =
    typeof searchParams?.subject === "string"
      ? searchParams.subject
      : undefined;

  return (
    <main>
      <h1>Contact</h1>
      <p>Subject (from query): {subject ?? "none"}</p>

      <form method="post" action="/api/contact">
        <label>
          Name
          <input name="name" />
        </label>
        <label>
          Message
          <textarea name="message" />
        </label>
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
