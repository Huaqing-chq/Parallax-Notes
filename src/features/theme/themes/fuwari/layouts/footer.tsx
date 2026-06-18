import { ClientOnly, useRouteContext } from "@tanstack/react-router";
import type { NavOption } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";

interface FooterProps {
  navOptions: Array<NavOption>;
}

export function Footer(_: FooterProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="border-t border-black/10 dark:border-white/15 my-10 border-dashed mx-4 md:mx-32" />
      <div className="border-dashed border-black/10 dark:border-white/15 rounded-2xl mb-8 flex flex-col items-center justify-center px-6 py-6">
        <div className="fuwari-text-50 text-sm text-center">
          {/* 版权信息 - 硬编码中文 */}
          <span>
            © {currentYear} ViaHarry 
          </span>{" "}
          /{" "}
          <a
            href="/rss.xml"
            target="_blank"
            rel="noreferrer"
            className="fuwari-expand-animation rounded-md px-1 -m-1 font-medium hover:text-(--fuwari-primary) text-(--fuwari-primary)"
          >
            RSS
          </a>{" "}
          /{" "}
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="fuwari-expand-animation rounded-md px-1 -m-1 font-medium hover:text-(--fuwari-primary) text-(--fuwari-primary)"
          >
            站点地图
          </a>
          <br />
          {/* 技术驱动 */}
          由{" "}
          <a
            href="https://tanstack.com/start"
            target="_blank"
            rel="noreferrer"
            className="fuwari-expand-animation rounded-md px-1 -m-1 font-medium hover:text-(--fuwari-primary) text-(--fuwari-primary)"
          >
            Tanstack Start
          </a>{" "}
          &{" "}
          <a
            href="https://github.com/du2333/flare-stack-blog"
            target="_blank"
            rel="noreferrer"
            className="fuwari-expand-animation rounded-md px-1 -m-1 font-medium hover:text-(--fuwari-primary) text-(--fuwari-primary)"
          >
            Flare Stack Blog
          </a>{" "}
          强力驱动
        </div>

        
        <div className="px-4 text-center text-sm text-muted-foreground">
          如无特别声明，本博客文字采用{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="license"
            className="underline hover:text-primary"
          >
            CC BY-NC-SA 4.0许可协议
          </a>{" "}
          进行许可。
          <img
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
            alt=""
            className="inline-block max-w-[1em] max-h-[1em] ml-1"
          />
          <img
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
            alt=""
            className="inline-block max-w-[1em] max-h-[1em] ml-1"
          />
          <img
            src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
            alt=""
            className="inline-block max-w-[1em] max-h-[1em] ml-1"
          />
          <img
            src="https://mirrors.creativecommons.org/presskit/icons/sa.svg"
            alt=""
            className="inline-block max-w-[1em] max-h-[1em] ml-1"
          />
        </div>
      </div>
    </>
  );
}
