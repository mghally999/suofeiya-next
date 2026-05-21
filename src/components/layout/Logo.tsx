import Image from 'next/image';
import Link from 'next/link';

/**
 * Suofeiya wordmark — the real brand asset.
 *
 * `public/logo/sfylogo.png` is the official lock-up lifted straight
 * from global.suofeiya.com (`sfy-activity.suofeiya.com.cn` →
 * `front/images/sfylogo.png`). Using the brand's own raster file
 * means the mark is pixel-identical to every other Suofeiya
 * surface and loads in a single HTTP request (~7 KB), no font
 * dependency to wait for.
 *
 * The PNG is white-on-transparent with a burgundy cube — it carries
 * across both header tones (over hero photo + scrolled cream) so we
 * don't need two variants any more.
 */
export default function Logo() {
  return (
    <Link href="/" aria-label="Suofeiya — home" className="site-header__brand brand-mark">
      <Image
        src="/logo/sfylogo.png"
        alt="Suofeiya"
        width={200}
        height={30}
        priority
        sizes="200px"
        style={{ height: 28, width: 'auto', display: 'block' }}
      />
    </Link>
  );
}
