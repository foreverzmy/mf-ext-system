import { type FC, memo } from 'react';
import { TitleBar, TitleBarProps } from './TitleBar';
import { ActivityBar } from './ActivityBar';
import { SideBar } from './SideBar';
import { MainArea } from './MainArea';
import { StatusBar } from './StatusBar';

export type LayoutProps = TitleBarProps & {
  className?: string;
};

export const Layout: FC<LayoutProps> = memo(({ title, className }) => (
  <div className={`layout flex flex-col w-full h-full overflow-hidden ${className}`}>
    {Boolean(title) && <TitleBar title={title} />}
    <div className="flex-1 flex flex-row overflow-hidden" style={{ maxWidth: '100vw' }}>
      <ActivityBar />
      <div className="flex-1 h-full flex flex-row overflow-hidden">
        <SideBar />
        <MainArea />
      </div>
    </div>
    <StatusBar />
  </div>
));
