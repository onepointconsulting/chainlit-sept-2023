import { Stack, Typography } from '@mui/material';

import { Logo } from 'components/atoms/logo';

declare global {
  interface Window {
    watermark?: {
      link?: string;
      message?: string;
      image?: string;
    };
  }
}

export default function WaterMark() {
  const watermarkConfig = window?.watermark;
  const link = watermarkConfig?.link ?? 'https://github.com/Chainlit/chainlit';
  const message = watermarkConfig?.message ?? 'Built with';

  return (
    <Stack mx="auto">
      <a
        href={link}
        target="_blank"
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}
      >
        <Typography fontSize="12px" color="text.secondary">
          {message}
        </Typography>
        <Logo
          width={65}
          style={{ filter: 'grayscale(1)', marginLeft: '4px' }}
          image={watermarkConfig?.image}
        />
      </a>
    </Stack>
  );
}
