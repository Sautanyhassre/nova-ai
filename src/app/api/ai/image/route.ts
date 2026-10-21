import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, style = 'Photorealistic', aspectRatio = '1:1', resolution = '1024x1024' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate artistic SVG visual data URI based on style, prompt, and aspect ratio
    const width = aspectRatio === '16:9' ? 1280 : aspectRatio === '9:16' ? 720 : 1000;
    const height = aspectRatio === '16:9' ? 720 : aspectRatio === '9:16' ? 1280 : 1000;

    // Palette selection based on style
    let gradientStart = '#4F46E5';
    let gradientEnd = '#06B6D4';
    let accent = '#F59E0B';

    if (style === 'Cyberpunk') {
      gradientStart = '#EC4899';
      gradientEnd = '#8B5CF6';
      accent = '#10B981';
    } else if (style === 'Anime') {
      gradientStart = '#F43F5E';
      gradientEnd = '#FB923C';
      accent = '#38BDF8';
    } else if (style === '3D Render') {
      gradientStart = '#3B82F6';
      gradientEnd = '#1E1B4B';
      accent = '#A855F7';
    } else if (style === 'Watercolor') {
      gradientStart = '#0D9488';
      gradientEnd = '#6EE7B7';
      accent = '#F472B6';
    }

    // Clean prompt for SVG display
    const sanitizedPrompt = prompt.replace(/[<>&"]/g, ' ').substring(0, 90);

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradientStart}" />
          <stop offset="50%" stop-color="#0B0F19" />
          <stop offset="100%" stop-color="${gradientEnd}" />
        </linearGradient>
        <radialGradient id="aurora" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.5" />
          <stop offset="100%" stop-color="transparent" stop-opacity="0" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="30" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) * 0.35}" fill="url(#aurora)" filter="url(#glow)" />
      <g opacity="0.15">
        <path d="M 0,${height * 0.7} Q ${width * 0.25},${height * 0.5} ${width * 0.5},${height * 0.75} T ${width},${height * 0.6} L ${width},${height} L 0,${height} Z" fill="#ffffff" />
      </g>
      <rect x="30" y="30" width="${width - 60}" height="${height - 60}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" rx="16" />
      <text x="${width / 2}" y="${height / 2 - 20}" font-family="system-ui, sans-serif" font-size="${Math.max(20, Math.floor(width / 32))}" font-weight="bold" fill="#ffffff" text-anchor="middle">
        NOVA AI STUDIO
      </text>
      <text x="${width / 2}" y="${height / 2 + 25}" font-family="system-ui, sans-serif" font-size="${Math.max(14, Math.floor(width / 45))}" fill="${accent}" text-anchor="middle" font-weight="600">
        [ ${style.toUpperCase()} • ${aspectRatio} ]
      </text>
      <text x="${width / 2}" y="${height - 60}" font-family="system-ui, sans-serif" font-size="14" fill="#94A3B8" text-anchor="middle">
        "${sanitizedPrompt}"
      </text>
    </svg>
    `.trim();

    const imageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    return NextResponse.json({
      success: true,
      image: {
        id: `img-${Date.now()}`,
        prompt,
        style,
        aspectRatio,
        resolution,
        imageUrl,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Image generation failed' }, { status: 500 });
  }
}
