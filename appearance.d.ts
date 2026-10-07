/** Explicit user appearance; callers validate stored values before applying. */
export interface SimulatorAppearance {
  background: string;
  accent: string;
  backgroundImage?: string;
}

export type AppearancePresetId = 'sage' | 'ocean' | 'sand' | 'night';
export interface AppearancePreset extends Readonly<SimulatorAppearance> {
  readonly id: AppearancePresetId;
}
export type AppearanceStyle = { colorScheme: 'dark' | 'light' } & Record<
  `--${string}`,
  string
>;

export declare const appearancePresets: readonly AppearancePreset[];
export declare const defaultAppearance: Readonly<SimulatorAppearance>;
export declare function appearanceTextColor(hex: string): string;
export declare function appearanceStyle(
  value: SimulatorAppearance,
): AppearanceStyle;
