const SUPABASE_URL = "https://gutdjwkuphmlrljxskgz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AroUizfnqDDW9YUfxWyE3A_XMfys25o";

// Initialize carefully to avoid "not defined" errors
let supabaseClient;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
    console.error("Supabase failed to load. Please check your internet or script order.", e);
}

async function signup(portal) {
    if (!supabaseClient) return alert("System still loading, please wait 2 seconds and try again.");

    const name = document.getElementById(`${portal}-name`).value.trim();
    const email = document.getElementById(`${portal}-email-signup`).value.trim();
    const password = document.getElementById(`${portal}-password-signup`).value.trim();
    const confirm = document.getElementById(`${portal}-confirm-password`).value.trim();

    if (password !== confirm) return alert("Passwords do not match!");

    const { data, error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
        alert("Signup Error: " + error.message);
    } else if (data.user) {
        // Match your database columns: full_name and role
        const { error: profileError } = await supabaseClient
            .from('profiles')
            .insert([{ id: data.user.id, full_name: name, role: portal }]);

        if (profileError) {
            console.error("Profile Error:", profileError.message);
            alert("Account created, but database profile failed. Try logging in.");
        } else {
            alert("Signup successful! Please login.");
            toggleForm(portal);
        }
    }
}

async function login(portal) {
    const email = document.getElementById(`${portal}-email`).value.trim();
    const password = document.getElementById(`${portal}-password`).value.trim();

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        alert("Login Error: " + error.message);
    } else {
        window.location.href = `${portal}.html`;
    }
}


