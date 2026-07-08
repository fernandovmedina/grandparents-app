import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconName = 'add' | 'back' | 'call' | 'camera' | 'delete' | 'edit' | 'home' | 'save';

type IconProps = {
  name: IconName;
  color?: string;
  size?: number;
};

export function Icon({ name, color = '#14213d', size = 24 }: IconProps) {
  const commonProps = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'add' && (
        <>
          <Circle cx="12" cy="12" r="9" {...commonProps} />
          <Path d="M12 8v8M8 12h8" {...commonProps} />
        </>
      )}
      {name === 'back' && <Path d="M15 18l-6-6 6-6" {...commonProps} />}
      {name === 'call' && (
        <Path
          d="M7.5 4.5l2 4-2 1.5c1.2 2.5 3 4.3 5.5 5.5l1.5-2 4 2c.4.2.6.6.5 1l-.8 3c-.1.5-.6.9-1.1.9C9.9 20.9 3.1 14.1 3.1 6.9c0-.5.4-1 .9-1.1l3-.8c.4-.1.8.1 1 .5z"
          {...commonProps}
        />
      )}
      {name === 'camera' && (
        <>
          <Path d="M8.5 7l1.2-2h4.6l1.2 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3.5z" {...commonProps} />
          <Circle cx="12" cy="13" r="3" {...commonProps} />
        </>
      )}
      {name === 'delete' && (
        <>
          <Path d="M5 7h14M10 11v6M14 11v6M8 7l1-3h6l1 3M7 7l1 13h8l1-13" {...commonProps} />
        </>
      )}
      {name === 'edit' && (
        <Path d="M4 17.5V20h2.5L17.8 8.7l-2.5-2.5L4 17.5zM14.5 7l2.5-2.5L19.5 7 17 9.5" {...commonProps} />
      )}
      {name === 'home' && (
        <>
          <Path d="M4 11.5L12 5l8 6.5" {...commonProps} />
          <Path d="M6.5 10.5V20h11v-9.5" {...commonProps} />
          <Rect x="10" y="14" width="4" height="6" rx="1" {...commonProps} />
        </>
      )}
      {name === 'save' && (
        <>
          <Path d="M5 4h11l3 3v13H5z" {...commonProps} />
          <Path d="M8 4v6h7V4M8 17h8" {...commonProps} />
        </>
      )}
    </Svg>
  );
}
