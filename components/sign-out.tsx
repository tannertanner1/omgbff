import { signOut } from "@/lib/auth";

export default function SignOut() {
  return (
    <div>
      <form
        action={async (formData: FormData) => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
