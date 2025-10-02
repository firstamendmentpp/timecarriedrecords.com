document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabase.createClient(
    "https://hzjtqrpbdydwjampnfkx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6anRxcnBiZHlkd2phbXBuZmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTE3ODEsImV4cCI6MjA3NDgyNzc4MX0.7xZMOgG41irpm6bPnjiKqZrejnvzAMm6bsOZtloeWGs"
  );

  // Get current user

  const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        // Not logged in → redirect
        window.location.href = "https://example.com"; 
        return;
    }

  console.log("Logged in user:", user.id, user.email);

  // Handle upload
  document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = document.getElementById("songFile").files[0];
    const title = document.getElementById("songTitle").value.trim();

    if (!file) return alert("Choose a file first.");
    if (!title) return alert("Enter a song title.");

    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;

      // Upload to Supabase storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from("songs")
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data } = supabase.storage.from("songs").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Save entry in the songs table
      const { error: dbError } = await supabase
        .from("songs")
        .insert([{ user_id: user.id, title, file_url: publicUrl }]);

      if (dbError) throw dbError;

      alert("Upload successful!");
      document.getElementById("uploadForm").reset();
      loadSongs(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    }
  });

  // Load user's songs
  async function loadSongs() {
    const { data: songs, error } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const songList = document.getElementById("songList");
    songList.innerHTML = songs.map(song => `
      <div>
        <strong>${song.title}</strong><br>
        <audio controls src="${song.file_url}"></audio>
      </div>
    `).join("");
  }

  loadSongs();
});