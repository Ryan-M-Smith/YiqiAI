/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [new URL("https://s3.polygon.io/public/assets/news/favicons/**")]
	}
};

module.exports = nextConfig;
