type HeroProps = {
  onOpenForm: () => void;
};

export function Hero({ onOpenForm }: HeroProps) {
  return (
    <section
      className="relative flex min-h-[86svh] items-center justify-center overflow-hidden pt-[72px]"
      aria-label="Первый экран"
    >
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-warm.svg')" }}
        />
        <div className="absolute inset-0 bg-black/52" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-14 pt-12 text-center text-white sm:px-6 sm:py-20">
        <p className="rounded-full bg-black/28 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-zinc-100">
          ЗАМЕР И КОНСУЛЬТАЦИЯ БЕСПЛАТНО
        </p>
        <h1 className="mt-6 max-w-[320px] text-[38px] font-extrabold leading-[1.16] tracking-[-0.01em] text-white [text-wrap:balance] sm:mt-3 sm:max-w-2xl sm:text-5xl">
          Оставь заявку на натяжные потолки и получи расчет стоимости с 90%
          точностью
        </h1>
        <button
          type="button"
          onClick={onOpenForm}
          className="mt-8 inline-flex h-14 min-w-[232px] items-center justify-center rounded-xl bg-gradient-to-r from-[#FFC824] to-[#FF7A00] px-8 text-[20px] font-semibold text-white shadow-[0_10px_24px_rgba(255,132,0,0.35)] transition hover:brightness-105 active:scale-[0.99] sm:mt-8 sm:h-12 sm:text-base"
          aria-label="Открыть форму заказа замера"
        >
          Заказать замер
        </button>
      </div>
    </section>
  );
}
