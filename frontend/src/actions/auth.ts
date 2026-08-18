"use server";

export async function registerAction(
    prevState: { success: Boolean; error: string} | null,
    formData: FormData
) {
    
    console.log("clicou!");
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log(name, email, password);

    return { success: true, error: "" };
}