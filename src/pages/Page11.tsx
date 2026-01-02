import { useEffect, useState } from "react";

type MediaItem = {
  name: string;
  url: string;
  type: "video" | "audio" | "image";
};

export default function Page11() {
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    // Load uploaded files from localStorage (simple + Bolt-safe)
    const stored = localStorage.getItem("mandastrong_media");
    if (stored) {
      setMedia(JSON.parse(stored));
    }
  }, []);

  return (
    <div style={{ padding: 30, color: "white" }}>
      <h1 style={{ color: "#b388ff" }}>Media Library</h1>
      <p>All created and uploaded assets appear here.</p>

      {media.length === 0 && (
        <p style={{ opacity: 0.7 }}>No media uploaded yet.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {media.map((item, i) => (
          <div
            key={i}
            style={{
              background: "#140b2d",
              borderRadius: 10,
              padding: 15,
            }}
          >
            <strong>{item.name}</strong>

            {item.type === "video" && (
              <video
                src={item.url}
                controls
                style={{ width: "100%", marginTop: 10 }}
              />
            )}

            {item.type === "audio" && (
              <audio
                src={item.url}
                controls
                style={{ width: "100%", marginTop: 10 }}
              />
            )}

            {item.type === "image" && (
              <img
                src={item.url}
                alt={item.name}
                style={{
                  width: "100%",
                  marginTop: 10,
                  borderRadius: 6,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
