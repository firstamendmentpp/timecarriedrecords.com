// time-carried-beats.js
document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabase.createClient(
    "https://hzjtqrpbdydwjampnfkx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6anRxcnBiZHlkd2phbXBuZmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTE3ODEsImV4cCI6MjA3NDgyNzc4MX0.7xZMOgG41irpm6bPnjiKqZrejnvzAMm6bsOZtloeWGs"
  );

  const userId = "3bb7ea6e-3af0-49ac-9acd-2af8575acb38";

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
  songList.innerHTML = songs.map((song, idx) => `
    <div class="song-card">
      <div class="cover-wrapper">
        <img src="${song.cover_url || 'images/default-cover.jpg'}" alt="${song.title} cover" class="song-cover">
        <button class="play-btn" data-idx="${idx}">▶</button>
      </div>
      <h3>${song.title}</h3>
      <audio id="audio-${idx}" src="${song.file_url}"></audio>
    </div>
  `).join("");

  // 🔊 Playback handling
  const buttons = document.querySelectorAll(".play-btn");
  let currentAudio = null;
  let currentBtn = null;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.idx;
      const audio = document.getElementById(`audio-${idx}`);

      // Stop previous song if another is playing
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentBtn) currentBtn.textContent = "▶";
      }

      if (audio.paused) {
        audio.play();
        btn.textContent = "⏸";
        currentAudio = audio;
        currentBtn = btn;
      } else {
        audio.pause();
        btn.textContent = "▶";
      }
    });
  });
});