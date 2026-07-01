<?php
/**
 * Plugin Name:       AccessibleWeb Widget
 * Plugin URI:        https://github.com/ifrederico/accessible-web-widget
 * Description:       Adds the AccessibleWeb accessibility widget to your site — font sizing, contrast modes, dyslexia-friendly font, text-to-speech, and more.
 * Version:           1.2.0
 * Requires at least: 5.0
 * Requires PHP:      7.2
 * Author:            ifrederico
 * Author URI:        https://github.com/ifrederico
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       accessible-web-widget
 *
 * @package AccessibleWebWidget
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'AWW_VERSION', '1.2.0' );
define( 'AWW_SCRIPT_URL', 'https://cdn.jsdelivr.net/gh/ifrederico/accessible-web-widget@1.2.0/dist/accessible-web-widget.min.js' );
define( 'AWW_OPTION_NAME', 'aww_settings' );

/**
 * Default settings.
 *
 * @return array
 */
function aww_get_defaults() {
	return array(
		'position' => 'bottom-right',
		'size'     => 44,
		'language' => 'auto',
	);
}

/**
 * Get saved settings merged with defaults.
 *
 * @return array
 */
function aww_get_settings() {
	$settings = get_option( AWW_OPTION_NAME, array() );
	return wp_parse_args( is_array( $settings ) ? $settings : array(), aww_get_defaults() );
}

/**
 * Allowed widget positions.
 *
 * @return array
 */
function aww_get_positions() {
	return array(
		'bottom-right' => __( 'Bottom right', 'accessible-web-widget' ),
		'bottom-left'  => __( 'Bottom left', 'accessible-web-widget' ),
		'top-right'    => __( 'Top right', 'accessible-web-widget' ),
		'top-left'     => __( 'Top left', 'accessible-web-widget' ),
	);
}

/**
 * Enqueue the widget script and inline options on the front end.
 */
function aww_enqueue_script() {
	wp_enqueue_script(
		'accessible-web-widget',
		AWW_SCRIPT_URL,
		array(),
		AWW_VERSION,
		true // Load in footer.
	);

	$settings = aww_get_settings();

	$options = array(
		'position' => $settings['position'],
		'size'     => absint( $settings['size'] ),
	);

	if ( 'auto' !== $settings['language'] ) {
		$options['lang'] = $settings['language'];
	}

	wp_add_inline_script(
		'accessible-web-widget',
		'window.AccessibleWebWidgetOptions = ' . wp_json_encode( $options ) . ';',
		'before'
	);
}
add_action( 'wp_enqueue_scripts', 'aww_enqueue_script' );

/**
 * Register settings, sections, and fields.
 */
function aww_register_settings() {
	register_setting(
		'aww_settings_group',
		AWW_OPTION_NAME,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'aww_sanitize_settings',
			'default'           => aww_get_defaults(),
		)
	);

	add_settings_section(
		'aww_main_section',
		__( 'Widget Settings', 'accessible-web-widget' ),
		'__return_false',
		'accessible-web-widget'
	);

	add_settings_field(
		'aww_position',
		__( 'Position', 'accessible-web-widget' ),
		'aww_render_position_field',
		'accessible-web-widget',
		'aww_main_section',
		array( 'label_for' => 'aww_position' )
	);

	add_settings_field(
		'aww_size',
		__( 'Button size (px)', 'accessible-web-widget' ),
		'aww_render_size_field',
		'accessible-web-widget',
		'aww_main_section',
		array( 'label_for' => 'aww_size' )
	);

	add_settings_field(
		'aww_language',
		__( 'Language', 'accessible-web-widget' ),
		'aww_render_language_field',
		'accessible-web-widget',
		'aww_main_section',
		array( 'label_for' => 'aww_language' )
	);
}
add_action( 'admin_init', 'aww_register_settings' );

/**
 * Sanitize settings before saving.
 *
 * @param mixed $input Raw input.
 * @return array
 */
function aww_sanitize_settings( $input ) {
	$defaults = aww_get_defaults();
	$input    = is_array( $input ) ? $input : array();
	$output   = array();

	$position           = isset( $input['position'] ) ? sanitize_key( $input['position'] ) : '';
	$output['position'] = array_key_exists( $position, aww_get_positions() ) ? $position : $defaults['position'];

	$size           = isset( $input['size'] ) ? absint( $input['size'] ) : 0;
	$output['size'] = ( $size >= 24 && $size <= 128 ) ? $size : $defaults['size'];

	$language           = isset( $input['language'] ) ? sanitize_text_field( $input['language'] ) : '';
	$output['language'] = preg_match( '/^(auto|[a-z]{2}(-[A-Za-z]{2})?)$/', $language ) ? $language : $defaults['language'];

	return $output;
}

/**
 * Render the position field.
 */
function aww_render_position_field() {
	$settings = aww_get_settings();
	?>
	<select id="aww_position" name="<?php echo esc_attr( AWW_OPTION_NAME ); ?>[position]">
		<?php foreach ( aww_get_positions() as $value => $label ) : ?>
			<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $settings['position'], $value ); ?>>
				<?php echo esc_html( $label ); ?>
			</option>
		<?php endforeach; ?>
	</select>
	<?php
}

/**
 * Render the size field.
 */
function aww_render_size_field() {
	$settings = aww_get_settings();
	?>
	<input type="number" id="aww_size" name="<?php echo esc_attr( AWW_OPTION_NAME ); ?>[size]"
		value="<?php echo esc_attr( $settings['size'] ); ?>" min="24" max="128" step="1" class="small-text" />
	<p class="description"><?php esc_html_e( 'Size of the widget button in pixels (24–128). Default: 44.', 'accessible-web-widget' ); ?></p>
	<?php
}

/**
 * Render the language field.
 */
function aww_render_language_field() {
	$settings = aww_get_settings();
	?>
	<input type="text" id="aww_language" name="<?php echo esc_attr( AWW_OPTION_NAME ); ?>[language]"
		value="<?php echo esc_attr( $settings['language'] ); ?>" class="regular-text" />
	<p class="description"><?php esc_html_e( 'Language code such as "en", "es", or "pt-BR". Use "auto" to detect from the browser. Default: auto.', 'accessible-web-widget' ); ?></p>
	<?php
}

/**
 * Add the settings page under Settings.
 */
function aww_add_settings_page() {
	add_options_page(
		__( 'AccessibleWeb Widget', 'accessible-web-widget' ),
		__( 'AccessibleWeb Widget', 'accessible-web-widget' ),
		'manage_options',
		'accessible-web-widget',
		'aww_render_settings_page'
	);
}
add_action( 'admin_menu', 'aww_add_settings_page' );

/**
 * Render the settings page.
 */
function aww_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="options.php" method="post">
			<?php
			settings_fields( 'aww_settings_group' );
			do_settings_sections( 'accessible-web-widget' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

/**
 * Add a Settings link on the Plugins screen.
 *
 * @param array $links Existing action links.
 * @return array
 */
function aww_plugin_action_links( $links ) {
	$settings_link = sprintf(
		'<a href="%s">%s</a>',
		esc_url( admin_url( 'options-general.php?page=accessible-web-widget' ) ),
		esc_html__( 'Settings', 'accessible-web-widget' )
	);
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'aww_plugin_action_links' );
