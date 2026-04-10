import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Forge - Generate minimal React starters with real app structure"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#38312b",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Logo + Brand lockup */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "56px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 512 512"
            style={{
              display: "flex",
              marginBottom: "16px",
            }}
          >
            <g fill="#ece5d8" stroke="#ece5d8" strokeWidth={1.5}>
              <path
                strokeWidth={25.179}
                d="M314.75 255.999c0 32.447-26.304 58.751-58.751 58.751s-58.751-26.304-58.751-58.751 26.304-58.751 58.751-58.751 58.751 26.304 58.751 58.751z"
              />
              <path
                strokeWidth={25.179}
                d="M403.565 208.192c13.534 23.33 20.3 34.993 20.3 47.807s-6.766 24.477-20.3 47.807l-32.292 55.659c-13.48 23.235-20.22 34.854-31.305 41.231-11.084 6.377-24.536 6.377-51.443 6.377h-65.039c-26.906 0-40.358 0-51.442-6.377s-17.825-17.996-31.306-41.231l-32.291-55.66C94.912 280.477 88.146 268.814 88.146 256s6.767-24.477 20.3-47.807l32.292-55.659c13.48-23.235 20.22-34.854 31.306-41.231s24.538-6.377 51.442-6.377h65.04c26.906 0 40.358 0 51.442 6.377 11.085 6.377 17.825 17.995 31.305 41.231z"
              />
            </g>
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: "48px",
              fontWeight: 600,
              color: "#ece5d8",
              letterSpacing: "-0.02em",
            }}
          >
            Forge
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 600,
            color: "#ece5d8",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: "32px",
          }}
        >
          Ship the starter you actually want to open
        </div>

        {/* Supporting text */}
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#a39b8f",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Generate minimal starters with theme support, RTL, and your choice of code quality tools like ESLint or Biome
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
