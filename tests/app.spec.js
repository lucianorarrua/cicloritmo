import { test, expect } from '@playwright/test';

test.describe('CicloRitmo', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
  });

  test('1. screen navigation: selector visible, other screens not mounted', async ({ page }) => {
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=← Volver a Rutinas')).not.toBeAttached();
    await expect(page.locator('text=Diseña tu Rutina Personalizada')).not.toBeAttached();
    await expect(page.locator('text=Parar')).not.toBeAttached();
    await expect(page.locator('text=¡Rutina Completada!')).not.toBeAttached();
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

    await expect(page.locator('text=← Volver a Rutinas')).toBeAttached();
    await expect(page.locator('text=Iniciación al Cardio')).toBeAttached();
  });

  test('4. audio toggles: metronome checkbox exists and is checked', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);

    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeAttached();
    await expect(checkbox).toBeChecked();
  });

  test('5. test sound button: "Probar Altavoces / Sonido" exists and is clickable', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);

    const soundButton = page.locator('text=Probar Altavoces / Sonido');
    await expect(soundButton).toBeAttached();
    await soundButton.click();
  });

  test('6. start workout: "INICIAR ENTRENAMIENTO" shows workout screen', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);

    await page.locator('text=INICIAR ENTRENAMIENTO Ahora').click();
    await page.waitForTimeout(200);

    await expect(page.locator('text=Parar')).toBeAttached();
    await expect(page.locator('text=Cadencia Recomendada')).toBeAttached();
  });

  test('7. header hidden during workout: "CicloRitmo" not in DOM', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO Ahora').click();
    await page.waitForTimeout(200);

    await expect(page.locator('text=CicloRitmo')).not.toBeAttached();
  });

  test('8. workout controls: play/pause toggles and next/prev buttons exist', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO Ahora').click();
    await page.waitForTimeout(200);

    const playPause = page.locator('button.bg-clay-ink');
    await expect(playPause).toBeAttached();

    const controlsSection = page.locator('div').filter({ hasText: 'Tiempo Transcurrido' });
    await expect(controlsSection.locator('button.rounded-full').nth(0)).toBeAttached();
    await expect(controlsSection.locator('button.rounded-full').nth(2)).toBeAttached();

    // Click play/pause and verify workout stays active
    await playPause.click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=Parar')).toBeAttached();

    // Click again to resume
    await playPause.click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=Parar')).toBeAttached();
  });

  test('9. stop confirmation modal: opens and closes with "Seguir Entrenando"', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO Ahora').click();
    await page.waitForTimeout(200);

    await page.locator('text=Parar').click();
    await page.waitForTimeout(150);

    await expect(page.locator('text=¿Estás seguro de parar?')).toBeAttached();
    await expect(page.locator('text=Seguir Entrenando')).toBeAttached();

    await page.locator('text=Seguir Entrenando').click();
    await page.waitForTimeout(150);

    await expect(page.locator('text=¿Estás seguro de parar?')).not.toBeAttached();
    await expect(page.locator('text=Parar')).toBeAttached();
  });

  test('10. stop workout: "Parar" then "Sí, Finalizar" returns to selector', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO Ahora').click();
    await page.waitForTimeout(200);

    await page.locator('text=Parar').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=¿Estás seguro de parar?')).toBeAttached();

    await page.locator('text=Sí, Finalizar').click();
    await page.waitForTimeout(200);

    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=Parar')).not.toBeAttached();
  });

  test('11. custom routine builder: add and remove intervals', async ({ page }) => {
    await page.locator('text=Diseñar Rutina Personalizada').click();
    await page.waitForTimeout(200);

    await expect(page.locator('text=Diseña tu Rutina Personalizada')).toBeAttached();

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
    await page.locator('text=INICIAR ENTRENAMIENTO Ahora').click();
    await page.waitForTimeout(300);

    // Iniciación al Cardio has 7 intervals; click next 7 times to finish
    const controlsSection = page.locator('div').filter({ hasText: 'Tiempo Transcurrido' });
    const nextBtn = controlsSection.locator('button.rounded-full').last();

    for (let i = 0; i < 7; i++) {
      await nextBtn.click();
      await page.waitForTimeout(100);
    }

    await expect(page.locator('text=¡Rutina Completada!')).toBeAttached();
    await expect(page.locator('text=Tiempo de Pedaleo')).toBeAttached();
    await expect(page.locator('text=Calorías Quemadas')).toBeAttached();
    await expect(page.locator('text=Distancia Aprox.')).toBeAttached();
  });

  test('13. metronome wheel: SVG exists on workout screen', async ({ page }) => {
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO Ahora').click();
    await page.waitForTimeout(200);

    const metronomeArea = page.locator('.ml-3.shrink-0');
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
    await expect(page.locator('text=← Volver a Rutinas')).toBeAttached();

    await page.locator('text=← Volver a Rutinas').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=← Volver a Rutinas')).not.toBeAttached();

    // From creator
    await page.locator('text=Diseñar Rutina Personalizada').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=Diseña tu Rutina Personalizada')).toBeAttached();

    await page.locator('text=← Cancelar y volver').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=Diseña tu Rutina Personalizada')).not.toBeAttached();

    // From summary
    await page.locator('text=Iniciación al Cardio').click();
    await page.waitForTimeout(150);
    await page.locator('text=INICIAR ENTRENAMIENTO Ahora').click();
    await page.waitForTimeout(200);

    const controlsSection = page.locator('div').filter({ hasText: 'Tiempo Transcurrido' });
    const nextBtn = controlsSection.locator('button.rounded-full').last();
    for (let i = 0; i < 7; i++) {
      await nextBtn.click();
      await page.waitForTimeout(50);
    }

    await expect(page.locator('text=¡Rutina Completada!')).toBeAttached();

    await page.locator('text=Volver al Menú Principal').click();
    await page.waitForTimeout(150);
    await expect(page.locator('text=A pedalear hoy')).toBeAttached();
    await expect(page.locator('text=¡Rutina Completada!')).not.toBeAttached();
  });

});
