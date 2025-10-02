// time-carried-beats.js
document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabase.createClient(
    "https://hzjtqrpbdydwjampnfkx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6anRxcnBiZHlkd2phbXBuZmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTE3ODEsImV4cCI6MjA3NDgyNzc4MX0.7xZMOgG41irpm6bPnjiKqZrejnvzAMm6bsOZtloeWGs"
  );

  // Hardcode your user UUID
  const userId = "ca57f373-f3ac-48c0-9d9e-b19992ab0654";

  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    document.getElementById("songList").innerHTML = "<p>Failed to load songs.</p>";
    return;
  }

  const songList = document.getElementById("songList");
  songList.innerHTML = songs.map(song => `
    <div>
      <strong>${song.title}</strong><br>
      <audio controls src="${song.file_url}"></audio>
    </div>
  `).join("");
});