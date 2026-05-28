import { IconlyIconProps } from "./types";

export const IconlySendMessage = ({ size = 24, color = "currentColor", secondColor = "currentColor" }: IconlyIconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M6.53677 21.28L20.0949 13.898C20.0957 13.8975 20.0965 13.897 20.0973 13.8965C20.098 13.8959 20.0988 13.8954 20.0996 13.895C20.7875 13.5187 21.1998 12.8263 21.1998 12.043C21.1998 11.259 20.7868 10.565 20.0968 10.188L6.53677 2.80497C5.79077 2.39897 4.90877 2.46697 4.23377 2.98197C3.56177 3.49597 3.26577 4.32097 3.46077 5.14697L4.85524 11.0022C5.0535 11.8487 5.06164 12.3128 4.84692 13.1169L3.46077 18.939C3.42077 19.106 3.40177 19.273 3.40177 19.438C3.40177 20.084 3.69877 20.693 4.23277 21.101C4.90777 21.618 5.78977 21.686 6.53677 21.28Z" fill={secondColor}></path>
      <path d="M14.0172 12.021L6.9825 12.021" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
};
