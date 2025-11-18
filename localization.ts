const translationData = {
    // Header
    header_title: {
        en: "Katla: TikTok Live Battle",
        id: "Katla: Pertarungan Live TikTok"
    },
    header_subtitle: {
        en: "Interactive Indonesian Wordle Game for TikTok LIVE",
        id: "Permainan Wordle Indonesia Interaktif untuk TikTok LIVE"
    },
    // Connect Form
    connect_form_label: {
        en: "Enter TikTok <b class='text-cyan-400'>@username</b> of LIVE user:",
        id: "Masukkan <b class='text-cyan-400'>@username</b> TikTok pengguna yang sedang LIVE:"
    },
    connect_form_placeholder: {
        en: "@username",
        id: "@username"
    },
    connect_form_button: {
        en: "Connect",
        id: "Hubungkan"
    },
    connect_form_connecting_button: {
        en: "Connecting...",
        id: "Menghubungkan..."
    },
    // Status Display
    status_title: {
        en: "Status",
        id: "Status"
    },
    // Simulation Mode
    sim_mode_title: {
        en: "Simulation Mode",
        id: "Mode Simulasi"
    },
    sim_mode_description: {
        en: "Enable this to test the game without a real TikTok LIVE connection. Use the control panel to send fake events. Requires local server.",
        id: "Aktifkan ini untuk menguji permainan tanpa koneksi TikTok LIVE sungguhan. Gunakan panel kontrol untuk mengirim event palsu. Membutuhkan server lokal."
    },
    sim_mode_button: {
        en: "Open Simulator Control Panel",
        id: "Buka Panel Kontrol Simulator"
    },
    // Navigation
    nav_game: { en: "Game", id: "Permainan" },
    nav_chat: { en: "Chat", id: "Obrolan" },
    nav_gifts: { en: "Gifts", id: "Hadiah" },
    nav_leaderboard: { en: "Leaderboard", id: "Peringkat" },
    nav_settings: { en: "Settings", id: "Pengaturan" },
    // Settings Tab
    settings_language_title: {
        en: "Language",
        id: "Bahasa"
    },
    // Room Stats
    room_stats_title: {
        en: "Room Stats",
        id: "Statistik Room"
    },
    // Disconnect/Reconnect
    disconnect_button: { en: "Disconnect", id: "Putuskan" },
    reconnect_title: { en: "Connection Lost", id: "Koneksi Terputus" },
    reconnect_button: { en: "Reconnect", id: "Hubungkan Kembali" },
    reconnect_button_connecting: { en: "Reconnecting...", id: "Menyambungkan Ulang..." },
    // Chat & Gift Box
    chat_title: { en: "Live Chat", id: "Obrolan Langsung" },
    gifts_title: { en: "Gifts", id: "Hadiah" },
    gift_sent_message: {
        en: (giftName: string, count: number) => `sent ${giftName} <span class="font-bold">x${count}</span>`,
        id: (giftName: string, count: number) => `mengirim ${giftName} <span class="font-bold">x${count}</span>`
    },
    // Gift Alert
    gift_alert_sent: {
        en: (giftName: string) => `sent ${giftName}!`,
        id: (giftName: string) => `mengirim ${giftName}!`
    },
    // Leaderboard
    leaderboard_title: { en: "Global Leaderboard", id: "Papan Peringkat Global" },
    leaderboard_no_scores: { en: "No scores yet. Be the first!", id: "Belum ada skor. Jadilah yang pertama!" },
    // Game
    game_title: { en: "Katla: Time Rush", id: "Katla: Time Rush" },
    game_subtitle: { en: "Game is now fully automatic!", id: "Permainan sekarang sepenuhnya otomatis!" },
    game_time_left: { en: "Time Left", id: "Sisa Waktu" },
    game_best_guess: { en: "Best Guess Clue", id: "Petunjuk Tebakan Terbaik" },
    game_no_guesses_yet: { en: "No valid guesses yet.", id: "Belum ada tebakan valid." },
    game_starting: { en: "Starting new round...", id: "Memulai ronde baru..." },
    // Game Overlays
    overlay_winners_title: { en: "Round Winners", id: "Pemenang Ronde" },
    overlay_leaderboard_title: { en: "Global Leaderboard", id: "Papan Peringkat Global" },
    overlay_times_up_title: { en: "Time's Up!", id: "Waktu Habis!" },
    overlay_correct_word: { en: "The correct word was:", id: "Kata yang benar adalah:" },
    overlay_next_round: { en: "Next round starts in...", id: "Ronde berikutnya dimulai dalam..." },
    overlay_waiting_next: { 
        en: "Type <code class='p-1.5 rounded bg-black/50 text-cyan-400'>!next</code> in comment for the next word!",
        id: "Ketik <code class='p-1.5 rounded bg-black/50 text-cyan-400'>!next</code> di komentar untuk kata berikutnya!"
    },
    overlay_waiting_likes: {
        en: "Tap-Tap the screen for likes!",
        id: "Tap-tap layar jika kamu suka game ini!"
    },
    // Dynamic Connection Messages
    connect_init: {
        en: "Enter a TikTok @username to connect.",
        id: "Masukkan @username TikTok untuk terhubung."
    },
    connect_connecting: {
        en: (username: string) => `Connecting to @${username}...`,
        id: (username: string) => `Menghubungkan ke @${username}...`
    },
    connect_reconnecting: {
        en: (username: string) => `Reconnecting to @${username}...`,
        id: (username: string) => `Menyambungkan ulang ke @${username}...`
    },
    connect_connected_sim: {
        en: "Connected in Simulation Mode.",
        id: "Terhubung dalam Mode Simulasi."
    },
    connect_connected_real: {
        en: (roomId: string) => `Connected to Room ID: ${roomId}`,
        id: (roomId: string) => `Terhubung ke Room ID: ${roomId}`
    },
    connect_disconnected_error: {
        en: (reason: string) => `Disconnected: ${reason}`,
        id: (reason: string) => `Terputus: ${reason}`
    },
    connect_disconnected_by_user: {
        en: "Disconnected by user.",
        id: "Koneksi diputus oleh pengguna."
    },
    connect_stream_ended: {
        en: "The Live stream has ended.",
        id: "Siaran Langsung telah berakhir."
    },
    // Dynamic Toasts
    error_empty_username: {
        en: "Username cannot be empty.",
        id: "Nama pengguna tidak boleh kosong."
    },
    rank_toast: {
        en: (nickname: string, rank: number, score: number) => `${nickname}, you are rank #${rank} with ${score} points!`,
        id: (nickname: string, rank: number, score: number) => `${nickname}, Kamu peringkat #${rank} dengan ${score} poin!`
    },
    rank_toast_not_found: {
        en: (nickname: string) => `${nickname}, you're not on the leaderboard yet. Keep playing!`,
        id: (nickname: string) => `${nickname}, Kamu belum ada di papan peringkat. Teruslah bermain!`
    },
    info_toast_filter: {
        en: "If your word is filtered, try sending it in a sentence!",
        id: "Jika katamu difilter, coba kirim dalam bentuk kalimat!"
    },
    error_not_in_dictionary: {
        en: (guess: string) => `'${guess}' not in dictionary.`,
        id: (guess: string) => `'${guess}' tidak ada di kamus.`
    },
    info_already_solved: {
        en: "You've already solved this word!",
        id: "Kamu sudah menyelesaikan kata ini!"
    },
};

// FIX: Updated the generic constraint to be more robust, fixing all type errors.
// This function processes the raw data into a usable format for each language
function createTranslations<T extends { [key: string]: { en: any; id: any; } }>(data: T) {
    const en: { [K in keyof T]: T[K]['en'] } = {} as any;
    const id: { [K in keyof T]: T[K]['id'] } = {} as any;

    for (const key in data) {
        // FIX: Added type assertion to safely assign properties in the loop.
        const typedKey = key as keyof T;
        en[typedKey] = data[key].en;
        id[typedKey] = data[key].id;
    }

    return { en, id };
}

export const translations = createTranslations(translationData);