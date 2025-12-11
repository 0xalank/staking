import Image from 'next/image';
import Link from 'next/link';

import LogoImageMobile from '@/public/images/logo_mobile.svg';
import LogoImage from '@/public/images/logo.svg';

const Logo = () => {
  return (
    <Link href="/" className="block cursor-pointer">
      <Image className="min-[475px]:hidden" src={LogoImageMobile} alt="logo" priority />
      <Image className="hidden min-[475px]:block" src={LogoImage} alt="logo" priority />
    </Link>
  );
};

export default Logo;
