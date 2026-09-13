import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Lenis from 'lenis'
import { describe, expect, it, vi } from 'vitest'
import Navbar from './Navbar'
import { SmoothScrollProvider } from '../../providers/SmoothScrollProvider'

/**
 * These cover the mobile menu's behaviour contract - open, close, and the
 * close-then-scroll ordering - rather than its animation. Framer Motion's
 * timings are not asserted; what matters is that the menu leaves the tree and
 * that navigation still reaches the scroll provider afterwards.
 */

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <SmoothScrollProvider>
        <Navbar />
      </SmoothScrollProvider>
    </MemoryRouter>
  )

const getMenuButton = () => screen.getByRole('button', { name: /open menu|close menu/i })

describe('Navbar mobile menu', () => {
  it('is closed on first render', () => {
    renderNavbar()

    const button = getMenuButton()
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'mobile-nav-menu')
  })

  it('opens on tap and exposes the section links', async () => {
    const user = userEvent.setup()
    renderNavbar()

    await user.click(getMenuButton())

    const menu = await screen.findByRole('list', { name: 'Site sections' })
    expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true')
    expect(within(menu).getByRole('link', { name: 'Projects' })).toBeInTheDocument()
  })

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    renderNavbar()

    await user.click(getMenuButton())
    await screen.findByRole('list', { name: 'Site sections' })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('list', { name: 'Site sections' })).not.toBeInTheDocument()
    })
  })

  it('closes when a tap lands outside the navbar', async () => {
    const user = userEvent.setup()
    renderNavbar()

    await user.click(getMenuButton())
    await screen.findByRole('list', { name: 'Site sections' })

    await user.click(document.body)

    await waitFor(() => {
      expect(screen.queryByRole('list', { name: 'Site sections' })).not.toBeInTheDocument()
    })
  })

  it('closes the menu before scrolling to the chosen section', async () => {
    const user = userEvent.setup()
    // matchMedia is stubbed to report no reduced-motion preference, so the
    // provider builds a real Lenis instance and routes through it rather than
    // the native fallback. Spying on the prototype catches that call.
    const lenisScrollTo = vi.spyOn(Lenis.prototype, 'scrollTo').mockImplementation(() => {})

    const section = document.createElement('section')
    section.id = 'projects'
    document.body.appendChild(section)

    try {
      renderNavbar()

      await user.click(getMenuButton())
      const menu = await screen.findByRole('list', { name: 'Site sections' })

      await user.click(within(menu).getByRole('link', { name: 'Projects' }))

      // Closing is immediate; the scroll is deferred behind the exit, so the
      // menu must already be gone by the time the scroll lands.
      await waitFor(() => {
        expect(getMenuButton()).toHaveAttribute('aria-expanded', 'false')
      })

      await waitFor(() => {
        expect(lenisScrollTo).toHaveBeenCalledWith('#projects', expect.anything())
      })
    } finally {
      section.remove()
      lenisScrollTo.mockRestore()
    }
  })

  it('toggles cleanly when the button is tapped repeatedly', async () => {
    renderNavbar()

    // Clicked via the element directly rather than through userEvent: its
    // pointer sequence also dispatches pointerdown on document, which the
    // outside-tap handler treats as a dismissal and would race the toggle.
    const button = getMenuButton()
    button.click()
    button.click()
    button.click()

    // An odd number of taps must leave it open, and only one menu may exist.
    await waitFor(() => {
      expect(getMenuButton()).toHaveAttribute('aria-expanded', 'true')
    })
    expect(screen.getAllByRole('list', { name: 'Site sections' })).toHaveLength(1)
  })
})
