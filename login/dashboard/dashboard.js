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
  const coverFile = document.getElementById("coverFile").files[0];
  const title = document.getElementById("songTitle").value.trim();

  if (!file) return alert("Choose a file first.");
  if (!title) return alert("Enter a song title.");

  try {
    // 1️⃣ Upload song
    const songPath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: songError } = await supabase
      .storage
      .from("songs")
      .upload(songPath, file, { upsert: true });

    if (songError) throw songError;

    const { data: songData } = supabase.storage.from("songs").getPublicUrl(songPath);
    const songUrl = songData.publicUrl;

    // 2️⃣ Upload cover if exists
    let coverUrl = 'images/default-cover.jpg'; // fallback
    if (coverFile) {
      const coverPath = `${user.id}/${Date.now()}_${coverFile.name}`;
      const { error: coverError } = await supabase
        .storage
        .from("covers")
        .upload(coverPath, coverFile, { upsert: true });

      if (coverError) throw coverError;

      const { data: coverData } = supabase.storage.from("covers").getPublicUrl(coverPath);
      coverUrl = coverData.publicUrl;
    }

    // 3️⃣ Save to DB
    const { error: dbError } = await supabase
      .from("songs")
      .insert([{ user_id: user.id, title, file_url: songUrl, cover_url: coverUrl }]);

    if (dbError) throw dbError;

    alert("Upload successful!");
    document.getElementById("uploadForm").reset();
    loadSongs();

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

  if (error) return console.error(error);

  const songList = document.getElementById("songList");
  songList.innerHTML = songs.map(song => `
    <div class="song-card">
      <img src="${song.cover_url}" alt="${song.title} cover" class="song-cover">
      <div class="song-info">
        <h3>${song.title}</h3>
        <audio controls src="${song.file_url}"></audio>
      </div>
    </div>
  `).join("");
}

  loadSongs();
});