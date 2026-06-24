import { test, expect } from '@playwright/test';

test.describe('CicloRitmo', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // Clear persisted state so each test starts deterministic
    await page.evaluate(() => window.localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
  });

  // Helper: wait for the 3-2-1 countdown to finish and the workout UI to appear.
  // Call this right after clicking "INICIAR ENTRENAMIENTO".
  async function waitForWorkoutStart(page) {
    // Countdown overlay shows 3,2,1 then the workout UI
    await page.locator('text=Cadencia').waitFor({ state: 'attached', timeout: 6000 });
    await page.waitForTimeout(100);
  }

  test('1. screen navigation: selector visible, other screens not mounted', async ({ page }) => {
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=Volver a Rutinas')).not.toBeAttached();
    await expect(page.locator('text=Diseña tu Rutina')).not.toBeAttached();
    await expect(page.locator('text=Parar')).not.toBeAttached();
    await expect(page.locator('text=Rutina Completada')).not.toBeAttached();
  });

  test('2. category filtering: clicking tabs changes routine count', async ({ page }) => {
    const initialCount = await page.locator('text=Pedalear →').count();
    expect(initialCount).toBeGreaterThan(0);

    await page.locator('text=Suave / Iniciación').click();
    await page.waitForTimeout(150);
    const suaveCount = await page.locator('text=Pedalear →').count();
    expect(suaveCount).toBeLessThan(initialCount);
    expect(suaveCount).toBeGreaterThan(0);

    await page.locator('text=HIIT / Tabata').click();
    await page.waitForTimeout(150);
    const hiitCount = await page.locator('text=Pedalear →').count();
    expect(hiitCount).toBeLessThan(initialCount);
    expect(hiitCount).toBeGreaterThan(0);

    await page.locator('text=Fuerza / Escalada').click();
    await page.waitForTimeout(150);
    const fuerzaCount = await page.locator('text=Pedalear →').count();
    expect(fuerzaCount).toBeGreaterThan(0);

    await page.locator('text=Fondo / Cardio').click();
    await page.waitForTimeout(150);
    const fondoCount = await page.locator('text=Pedalear →').count();
    expect(fondoCount).toBeGreaterThan(0);

    await page.locator('text=Todos').click();
    await page.waitForTimeout(150);
    const allCount = await page.locator('text=Pedalear →').count();
    expect(allCount).toBe(initialCount);
  });

  test('3. routine selection: clicking a card shows pre-workout', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);

    await expect(page.locator('text=Volver a Rutinas')).toBeAttached();
    await expect(page.locator('text=Iniciación al Cardio')).toBeAttached();
  });

  test('4. audio toggles: metronome toggle exists and is clickable', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);

    const metronomeToggle = page.locator('text=Metrónomo de Cadencia');
    await expect(metronomeToggle).toBeAttached();
    await metronomeToggle.click();
    await page.waitForTimeout(100);
    await expect(metronomeToggle).toBeAttached();
  });

  test('5. test sound button: "Probar Altavoces" exists and is clickable', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);

    const soundButton = page.locator('text=Probar Altavoces');
    await expect(soundButton).toBeAttached();
    await soundButton.click();
  });

  test('6. start workout: "INICIAR ENTRENAMIENTO" shows workout screen', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);

    await page.locator('text=INICIAR ENTRENAMIENTO').click();
    // Countdown overlay should be visible first
    await expect(page.locator('text=Prepárate')).toBeAttached();

    await waitForWorkoutStart(page);

    await expect(page.locator('text=Parar')).toBeAttached();
    await expect(page.locator('text=Cadencia')).toBeAttached();
  });

  test('7. header hidden during workout: "CicloRitmo" not in DOM', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO').click();
    await waitForWorkoutStart(page);

    await expect(page.locator('text=CicloRitmo')).not.toBeAttached();
  });

  test('8. workout controls: play/pause toggles and next/prev buttons exist', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO').click();
    await waitForWorkoutStart(page);

    const playPause = page.locator('button').filter({ has: page.locator('svg') }).nth(2);
    await expect(playPause).toBeAttached();

    // Verify prev and next buttons exist (svg buttons in the controls row)
    const allSvgButtons = page.locator('button svg');
    expect(await allSvgButtons.count()).toBeGreaterThanOrEqual(3);

    // Click play/pause and verify workout stays active
    await playPause.click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=Parar')).toBeAttached();

    // Click again to resume
    await playPause.click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=Parar')).toBeAttached();
  });

  test('9. stop confirmation modal: opens and closes with "Seguir"', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO').click();
    await waitForWorkoutStart(page);

    await page.locator('text=Parar').click();
    await page.waitForTimeout(150);

    await expect(page.locator('text=¿Estás seguro?')).toBeAttached();
    await expect(page.locator('button:has-text("Seguir")')).toBeAttached();

    await page.locator('button:has-text("Seguir")').click();
    await page.waitForTimeout(150);

    await expect(page.locator('text=¿Estás seguro?')).not.toBeAttached();
    await expect(page.locator('text=Parar')).toBeAttached();
  });

  test('10. stop workout: "Parar" then "Finalizar" returns to selector', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO').click();
    await waitForWorkoutStart(page);

    await page.locator('text=Parar').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=¿Estás seguro?')).toBeAttached();

    await page.locator('button:has-text("Finalizar")').click();
    await page.waitForTimeout(200);

    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=Parar')).not.toBeAttached();
  });

  test('11. custom routine builder: add and remove intervals', async ({ page }) => {
    await page.locator('text=Diseñar Rutina').click();
    await page.waitForTimeout(200);

    await expect(page.locator('text=Diseña tu Rutina')).toBeAttached();

    const emptyMessage = page.locator('text=No hay intervalos aún');
    await expect(emptyMessage).toBeAttached();

    await page.locator('text=Añadir Bloque').click();
    await page.waitForTimeout(150);

    await expect(page.locator('text=No hay intervalos aún')).not.toBeAttached();

    // Verify new interval appears with its name
    await expect(page.locator('text=Trabajo').first()).toBeAttached();

    // Remove the interval
    await page.locator('button[title="Borrar intervalo"]').click();
    await page.waitForTimeout(150);

    await expect(page.locator('text=No hay intervalos aún')).toBeAttached();
  });

  test('12. workout completion: skip through intervals to reach summary', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO').click();
    await waitForWorkoutStart(page);

    // Iniciación al Cardio has 7 intervals; click next 7 times to finish
    const nextBtn = page.locator('button.rounded-full').last();
    for (let i = 0; i < 7; i++) {
      await nextBtn.click();
      await page.waitForTimeout(100);
    }

    await expect(page.locator('text=Rutina Completada')).toBeAttached();
    await expect(page.locator('text=Tiempo')).toBeAttached();
    await expect(page.locator('text=Calorías')).toBeAttached();
    await expect(page.locator('text=Distancia')).toBeAttached();
  });

  test('13. metronome wheel: SVG exists on workout screen', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO').click();
    await waitForWorkoutStart(page);

    const metronomeArea = page.locator('.relative.w-20');
    await expect(metronomeArea.locator('svg').first()).toBeAttached();
  });

  test('14. mobile layout: 375x812 viewport shows header and selector elements', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);

    await expect(page.locator('text=CicloRitmo').first()).toBeAttached();
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=Iniciación al Cardio')).toBeAttached();
  });

  test('15. back navigation: return to selector from pre-workout, creator, and summary', async ({ page }) => {
    // From pre-workout
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=Volver a Rutinas')).toBeAttached();

    await page.locator('text=Volver a Rutinas').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=Volver a Rutinas')).not.toBeAttached();

    // From creator
    await page.locator('text=Diseñar Rutina').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=Diseña tu Rutina')).toBeAttached();

    await page.locator('text=Cancelar y volver').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=Diseña tu Rutina')).not.toBeAttached();

    // From summary
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO').click();
    await waitForWorkoutStart(page);

    const nextBtn = page.locator('button.rounded-full').last();
    for (let i = 0; i < 7; i++) {
      await nextBtn.click();
      await page.waitForTimeout(50);
    }

    await expect(page.locator('text=Rutina Completada')).toBeAttached();

    await page.locator('text=Volver al Menú Principal').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=Rutina Completada')).not.toBeAttached();
  });

});
