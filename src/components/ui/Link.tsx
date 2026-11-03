import { cn } from '@/utils';

type UnderlineLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

/**
 * Animated underline link matching the prototype's `.ul`.
 */
export default function UnderlineLink({ className, children, ...rest }: UnderlineLinkProps) {
  return (
    <a className={cn('ul', className)} {...rest}>
      {children}
    </a>
  );
}
