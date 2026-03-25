import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.easy.com.co/');
  await page.getByRole('textbox', { name: '¿Qué estás buscando? Buscar' }).click();
  await page.getByRole('textbox', { name: '¿Qué estás buscando? Buscar' }).fill('bosch');
  await page.getByRole('textbox', { name: '¿Qué estás buscando? Buscar' }).press('Enter');

  // Busca producto "inalámbrico"
  const productLocator = page.locator(
    'a.vtex-product-summary-2-x-clearLink:has(span.vtex-product-summary-2-x-productBrand, h2)'
  ).filter({
    hasText: /inalámbrico/i
  });

  await productLocator.first().waitFor();
  await productLocator.first().click();

  // Click en "Agregar al carro"
  const addToCartBtn = page.getByText('Agregar al carro', { exact: false });
  await addToCartBtn.waitFor();
  await addToCartBtn.click();

  // ✅ Email que vamos a ingresar
  const testEmail = 'test@test.com';

  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(testEmail);

  // ✅ Botón enviar
  const labelEnviar = page.locator('div.vtex-button__label', { hasText: /Enviar/i });
  await labelEnviar.waitFor();

  const botonEnviar = labelEnviar.locator(
    'xpath=ancestor::*[contains(@class,"vtex-button") or contains(@class,"pointer")][1]'
  );

  await expect(botonEnviar).toBeVisible();
  await expect(botonEnviar).not.toHaveClass(/disabled|o-50/);

  await botonEnviar.click();

  // ✅ Validar que en la siguiente pantalla el correo coincide
  const emailShown = page.locator(
    'span.tiendasjumboqaio-easy-delivery-modal-1-x-mailText__email'
  );

  await emailShown.waitFor();

  const value = await emailShown.textContent();

  expect(value?.trim()).toBe(testEmail);


  // ✅ Abrir el dropdown de Departamento
  await page.locator('.css-dvua67-singleValue', { hasText: 'Departamento' })
  .locator('xpath=ancestor::div[contains(@class,"control") or contains(@class,"container")][1]')
  .click();

  // ✅ Seleccionar la opción deseada del menú
  await page.getByText('ANTIOQUIA', { exact: true }).click();

  
  // ✅ Ciudad
  await page.locator('.css-dvua67-singleValue', { hasText: 'Ciudad' })
  .locator('xpath=ancestor::div[contains(@class,"control") or contains(@class,"container")][1]')
  .click();
  await page.getByText('Medellín', { exact: true }).click();

  // ✅ Dirección
  await page.getByPlaceholder('Ingresa tu dirección').fill('Calle 123 #45-67');


  // ✅ Localizar el texto del botón "Confirmar"
  const labelConfirmar = page.locator('div.vtex-button__label', { hasText: /Confirmar/i });

  // ✅ Esperar que exista el label
  await labelConfirmar.waitFor();

  // ✅ Subir al contenedor clickeable real (padre con clase vtex-button o pointer)
  const botonConfirmar = labelConfirmar.locator(
  'xpath=ancestor::*[contains(@class,"vtex-button") or contains(@class,"pointer")][1]'
  );

  // ✅ Asegurarse de que esté visible
  await expect(botonConfirmar).toBeVisible();

  // ✅ Validar que no tenga clases de deshabilitado (VTEX no always usa disabled real)
  await expect(botonConfirmar).not.toHaveClass(/disabled|o-50/);

  // ✅ Hacer clic en el botón Confirmar
  await botonConfirmar.click();

// ✅ Locator preciso del mensaje del modal
const modalMessage = page.locator(
  'span.tiendasjumboqaio-easy-delivery-modal-1-x-textDeliveryEnd'
);

// ✅ Esperar a que aparezca el modal
await expect(modalMessage).toBeVisible({ timeout: 3000 });

// ✅ Validar que el texto sea EXACTAMENTE el esperado
await expect(modalMessage).toHaveText('¡Listo hemos guardado tu configuración!');

//await page.pause();


});